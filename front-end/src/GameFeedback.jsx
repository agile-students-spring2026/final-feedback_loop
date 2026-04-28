import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./GameFeedback.css";
import AppLayout from "./AppLayout";
import { apiFetch } from "./api";

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
};

const getInitials = (name) => name?.[0]?.toUpperCase() || "?";

const BLANK_PFP = "https://res.cloudinary.com/dpdidryxs/image/upload/v1776738351/blank-pfp_yk8bl5.png";

const Avatar = ({ name, profilePic, isDev, size = 32 }) => {
  const src = profilePic && profilePic !== BLANK_PFP ? profilePic : null;
  return (
    <div
      className={`fbAvatar ${isDev ? "fbAvatarDev" : ""}`}
      style={{ width: size, height: size, padding: src ? 0 : undefined, overflow: "hidden" }}
    >
      {src
        ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }} />
        : getInitials(name)
      }
    </div>
  );
};

const GameFeedback = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [activeForms, setActiveForms] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); 
  const [replyInputs, setReplyInputs] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("authUser") || "{}");

  const loadComments = async () => {
    const res = await apiFetch(`/feedback-comments/${id}`);
    if (res.ok) setComments(await res.json());
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const projRes = await apiFetch(`/projects/${id}`);
        const projData = await projRes.json();
        if (cancelled) return;
        if (!projData || !projData.id) {
          setNotFound(true);
        } else {
          setProject(projData);
          await loadComments();
          const formsRes = await apiFetch(`/feedback/${id}`);
          if (formsRes.ok) {
            const summaries = await formsRes.json();
            if (!cancelled)
              setActiveForms(summaries.filter((f) => f.status === "Active"));
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleLike = async (commentId) => {
    const res = await apiFetch(`/feedback-comments/${commentId}/like`, { method: "POST" });
    if (res.ok) {
      const updated = await res.json();
      setComments(comments.map((c) => (c.id === commentId ? updated : c)));
    }
  };

  const handleSendComment = async () => {
    if (replyText.trim() === "") return;
    const res = await apiFetch(`/feedback-comments`, {
      method: "POST",
      body: JSON.stringify({ projectId: Number(id), text: replyText }),
    });
    if (res.ok) {
      setReplyText("");
      await loadComments();
    }
  };

  const handleReplyToggle = (commentId) => {
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
  };

  const handleReplySubmit = async (commentId) => {
    const text = replyInputs[commentId]?.trim();
    if (!text) return;
    const res = await apiFetch(`/feedback-comments/${commentId}/reply`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const updated = await res.json();
      setComments(comments.map((c) => (c.id === commentId ? updated : c)));
      setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
      setReplyingTo(null);
    }
  };

  const getPic = (name) =>
    name === currentUser.username ? currentUser.profilePic : null;

  if (loading) {
    return (
      <AppLayout>
        <div className="fbPage">
          <div className="fbBody"><p className="fbEmpty">Loading…</p></div>
        </div>
      </AppLayout>
    );
  }

  if (notFound) {
    return (
      <AppLayout>
        <div className="fbPage">
          <div className="fbBanner">
            <div className="fbBannerInfo">
              <button className="fbBackBtn" onClick={() => navigate(-1)}>← Back</button>
              <p className="fbBannerTitle">Project not found</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="fbPage">

        {/* Banner */}
        <div className="fbBanner">
          {project.coverPreview && (
            <img src={project.coverPreview} alt={project.title} className="fbBannerImg" />
          )}
          <div className="fbBannerInfo">
            <button className="fbBackBtn" onClick={() => navigate(-1)}>← Back</button>
            <p className="fbBannerTitle">{project.title}</p>
          </div>
        </div>

        {activeForms.length > 0 && (
          <div className="fbFormStrip">
            <span className="fbFormStripLabel">Active forms</span>
            {activeForms.map((f) => (
              <button
                key={f.formId}
                className="fbFormBtn"
                onClick={() => navigate(`/feedback-form/${f.formId}`)}
              >
                {f.title}
              </button>
            ))}
          </div>
        )}

        <div className="fbBody">

          <div className="fbCommentsHeader">
            <span className="fbCommentsLabel">Comments</span>
            <span className="fbCommentsCount">{comments.length} total</span>
          </div>

          {comments.length === 0 && (
            <p className="fbEmpty">No feedback yet. Be the first!</p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="fbComment">
              <div className="fbCommentInner">
                <div className="fbCommentHeader">
                  <Avatar
                    name={comment.player}
                    profilePic={comment.profilePic || getPic(comment.player)}
                  />
                  <span className="fbCommentName">{comment.player}</span>
                  <span className="fbCommentTime">{formatTime(comment.createdAt)}</span>
                </div>
                <p className="fbCommentText">{comment.text}</p>
                <div className="fbCommentActions">
                  <button className="fbSmallBtn" onClick={() => handleLike(comment.id)}>
                    ♡ {comment.likes}
                  </button>
                  <button
                    className={`fbSmallBtn ${replyingTo === comment.id ? "fbSmallBtnActive" : ""}`}
                    onClick={() => handleReplyToggle(comment.id)}
                  >
                    Reply
                  </button>
                </div>
              </div>

              {comment.replies?.length > 0 && (
                <div className="fbReplies">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="fbReply">
                      <Avatar
                        name={reply.name}
                        profilePic={reply.profilePic || getPic(reply.name)}
                        isDev={reply.isDev}
                        size={26}
                      />
                      <div className="fbReplyBody">
                        <div className="fbReplyHeader">
                          <span className="fbCommentName">{reply.name}</span>
                          {reply.isDev && <span className="fbDevBadge">Dev</span>}
                          <span className="fbCommentTime">{formatTime(reply.createdAt)}</span>
                        </div>
                        <p className="fbReplyText">{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo === comment.id && (
                <div className="fbInlineReply">
                  <Avatar
                    name={currentUser.username}
                    profilePic={currentUser.profilePic}
                    size={26}
                  />
                  <div className="fbInlineReplyInner">
                    <textarea
                      className="fbInput fbInlineReplyInput"
                      rows={2}
                      placeholder="Write a reply…"
                      value={replyInputs[comment.id] || ""}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({ ...prev, [comment.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleReplySubmit(comment.id);
                        }
                      }}
                      autoFocus
                    />
                    <div className="fbInlineReplyFooter">
                      <button className="fbDiscardBtn" onClick={() => setReplyingTo(null)}>
                        Cancel
                      </button>
                      <button className="fbSendBtn" onClick={() => handleReplySubmit(comment.id)}>
                        Post Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="fbInputArea">
            <div className="fbInputHeader">
              <span className="fbInputHeaderLabel">Leave a comment</span>
            </div>
            <div className="fbInputInner">
              <div className="fbInputRow">
                <Avatar
                  name={currentUser.username}
                  profilePic={currentUser.profilePic}
                />
                <textarea
                  className="fbInput"
                  rows={3}
                  placeholder="Share your thoughts…"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendComment()}
                />
              </div>
              <div className="fbInputFooter">
                <button className="fbDiscardBtn" onClick={() => setReplyText("")}>
                  Discard
                </button>
                <button className="fbSendBtn" onClick={handleSendComment}>
                  Post Comment
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default GameFeedback;