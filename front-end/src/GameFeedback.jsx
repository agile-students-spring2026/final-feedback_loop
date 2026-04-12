import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GameFeedback.css";
import AppLayout from "./AppLayout";

const GameFeedback = () => {
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch("/comments")
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => console.error(err));
  }, []);

  const handleLike = (commentId) => {
    fetch(`/comments/${commentId}/like`, {
      method: "POST",
    }).catch((err) => console.error(err));

    setComments(
      comments.map((c) => {
        if (c.id === commentId) {
          return { ...c, likes: c.likes + 1 };
        }
        return c;
      })
    );
  };

  const handleSendReply = () => {
    if (replyText.trim() === "") return;

    fetch("/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: "You", text: replyText }),
    })
      .then((res) => res.json())
      .then((data) => setComments([...comments, data]))
      .catch((err) => console.error(err));

    setReplyText("");
  };

  return (
    <AppLayout>
    <div className="fbPage">
      <div className="fbHeaderBar">FEEDBACK</div>

      <div className="fbBody">
        <button className="fbBackBtn" onClick={() => navigate("/following")}>
          Back
        </button>

        <div className="fbBanner">
          <p className="fbBannerTitle">Project Alpha</p>
          <img
            src="https://picsum.photos/seed/alpha/800/400"
            alt="Project Alpha"
            className="fbBannerImg"
          />
        </div>

        <button
          className="fbFormBtn"
          onClick={() => navigate("/feedback-form")}
        >
          Feedback Form
        </button>

        <div className="fbComments">
          {comments.map((comment) => (
            <div key={comment.id} className="fbComment">
              <div className="fbCommentHeader">
                <div className="fbAvatar"></div>
                <span className="fbCommentName">{comment.player}</span>
                <span className="fbCommentTime">{comment.time}</span>
              </div>
              <p className="fbCommentText">{comment.text}</p>
              <div className="fbCommentActions">
                <button
                  className="fbSmallBtn"
                  onClick={() => handleLike(comment.id)}
                >
                  LIKES {comment.likes}
                </button>
                <button className="fbSmallBtn">REPLY</button>
              </div>

              {comment.replies && comment.replies.map((reply) => (
                <div key={reply.id} className="fbReply">
                  <div className="fbCommentHeader">
                    <div className="fbAvatar fbAvatarDev"></div>
                    <span className="fbCommentName">{reply.name}</span>
                    <span className="fbCommentTime">{reply.time}</span>
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
            placeholder="TYPE REPLY HERE"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button className="fbSmallBtn fbSendBtn" onClick={handleSendReply}>
            SEND
          </button>
        </div>

        <button className="fbDiscardBtn">Discard</button>
      </div>
    </div>
    </AppLayout>
  );
};

export default GameFeedback;
