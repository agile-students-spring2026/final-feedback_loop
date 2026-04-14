import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./GameFeedback.css";
import AppLayout from "./AppLayout";
import { feedbackComments } from "./mockData";

const GameFeedback = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState(feedbackComments);

  const handleLike = (commentId) => {
    setComments(
      comments.map((c) => {
        if (c.id === commentId) {
          return { ...c, likes: c.likes + 1 };
        }
        return c;
      }),
    );
  };

  const handleSendReply = () => {
    if (replyText.trim() === "") return;
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
            onClick={() => navigate(`/feedback-form/${id}`)}
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

                {comment.replies.map((reply) => (
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
