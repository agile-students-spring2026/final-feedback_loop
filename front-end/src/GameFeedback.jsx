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

const GameFeedback = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [activeForms, setActiveForms] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
              setActiveForms(
                summaries.filter((f) => f.status === "Active")
              );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleLike = async (commentId) => {
    const res = await apiFetch(`/feedback-comments/${commentId}/like`, {
      method: "POST",
    });
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

  const handleReply = async (commentId) => {
    const text = window.prompt("Your reply:");
    if (!text || !text.trim()) return;
    const res = await apiFetch(`/feedback-comments/${commentId}/reply`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const updated = await res.json();
      setComments(comments.map((c) => (c.id === commentId ? updated : c)));
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="fbPage">
          <div className="fbHeaderBar">FEEDBACK</div>
          <div className="fbBody">Loading…</div>
        </div>
      </AppLayout>
    );
  }

  if (notFound) {
    return (
      <AppLayout>
        <div className="fbPage">
          <div className="fbHeaderBar">FEEDBACK</div>
          <div className="fbBody">
            <button className="fbBackBtn" onClick={() => navigate(-1)}>
              Back
            </button>
            <p>Project not found.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="fbPage">
        <div className="fbHeaderBar">FEEDBACK</div>

        <div className="fbBody">
          <button className="fbBackBtn" onClick={() => navigate(-1)}>
            Back
          </button>

          <div className="fbBanner">
            <p className="fbBannerTitle">{project.title}</p>
            {project.coverPreview && (
              <img
                src={project.coverPreview}
                alt={project.title}
                className="fbBannerImg"
              />
            )}
          </div>

          {activeForms.length === 0 ? (
            <p className="fbEmpty">No active feedback forms for this project.</p>
          ) : (
            <div className="fbFormList">
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

          <div className="fbComments">
            {comments.length === 0 && (
              <p className="fbEmpty">No feedback yet. Be the first!</p>
            )}
            {comments.map((comment) => (
              <div key={comment.id} className="fbComment">
                <div className="fbCommentHeader">
                  <div className="fbAvatar"></div>
                  <span className="fbCommentName">{comment.player}</span>
                  <span className="fbCommentTime">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
                <p className="fbCommentText">{comment.text}</p>
                <div className="fbCommentActions">
                  <button
                    className="fbSmallBtn"
                    onClick={() => handleLike(comment.id)}
                  >
                    LIKES {comment.likes}
                  </button>
                  <button
                    className="fbSmallBtn"
                    onClick={() => handleReply(comment.id)}
                  >
                    REPLY
                  </button>
                </div>

                {comment.replies.map((reply) => (
                  <div key={reply.id} className="fbReply">
                    <div className="fbCommentHeader">
                      <div
                        className={`fbAvatar ${reply.isDev ? "fbAvatarDev" : ""}`}
                      ></div>
                      <span className="fbCommentName">{reply.name}</span>
                      <span className="fbCommentTime">
                        {formatTime(reply.createdAt)}
                      </span>
                    </div>
                    <p className="fbCommentText">{reply.text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="fbInputRow">
            <input
              type="text"
              className="fbInput"
              placeholder="Leave a comment..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
            />
            <button
              className="fbSmallBtn fbSendBtn"
              onClick={handleSendComment}
            >
              SEND
            </button>
          </div>

          <button
            className="fbDiscardBtn"
            onClick={() => setReplyText("")}
          >
            Discard
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default GameFeedback;
