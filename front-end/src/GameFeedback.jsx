import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GameFeedback.css";

const GameFeedback = () => {
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState("");

  const [comments, setComments] = useState([
    {
      id: 1,
      player: "Player #1",
      time: "2 hours ago",
      text: "I loved it great game. Level 3 was my favorite",
      likes: 4,
      replies: [
        {
          id: 101,
          name: "Studio 1",
          isDev: true,
          time: "1 hour ago",
          text: "Thanks, fixing it next patch.",
        },
      ],
    },
    {
      id: 2,
      player: "Player #2",
      time: "5 hours ago",
      text: "Really enjoying the art style",
      likes: 7,
      replies: [],
    },
    {
      id: 3,
      player: "Player #3",
      time: "1 day ago",
      text: "Found a physics bug",
      likes: 2,
      replies: [],
    },
  ]);

  const handleLike = (commentId) => {
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
    setReplyText("");
  };

  return (
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
  );
};

export default GameFeedback;
