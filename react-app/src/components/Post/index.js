import React, { useState } from "react";
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import Editor from "draft-js-plugins-editor";
import { EditorState, convertFromRaw } from "draft-js";
import createMentionPlugin from "draft-js-mention-plugin";
import { useHistory, Link } from "react-router-dom";
import CommentInput from "../CommentInput";
import Comment from "../Comment";
import "./post.css";

function Post({ post }) {
    const history = useHistory();
    const [userMentionPlugin] = useState(
        createMentionPlugin({
            mentionComponent: (mentionProps) => (
                <span
                    className={`${mentionProps.className} post-mention`}
                    onClick={(event) => {
                        event.stopPropagation();
                        history.push(`/${mentionProps.mention.name}`);
                    }}
                >
                    {mentionProps.children}
                </span>
            ),
            theme: {
                mention: "mention",
            },
            mentionPrefix: "@",
        })
    );
    const [hashtagMentionPlugin] = useState(
        createMentionPlugin({
            mentionComponent: (mentionProps) => (
                <span
                    className={`${mentionProps.className} post-mention`}
                    onClick={(event) => {
                        event.stopPropagation();
                        history.push(`/explore/tags/${mentionProps.mention.name}/`);
                    }}
                >
                    {mentionProps.children}
                </span>
            ),
            theme: {
                mention: "mention",
            },
            mentionTrigger: "#",
            mentionPrefix: "#",
        })
    );

    const plugins = [userMentionPlugin, hashtagMentionPlugin];
    let data = JSON.parse(post.captionRawData);
    data = convertFromRaw(data);
    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(data)
    );

    return (
        <div className="feed_post-container">
            <Link to={`/${post.user.username}`}>
                <div className="feed_post-header">
                    <img src={post.user.profilePicUrl} alt="user-icon" />
                    <p className="feed_post-username">{post.user.username}</p>
                </div>
            </Link>

            <div className="feed_post-image">
                <img
                    src={
                        (post.images[0] && post.images[0].imgUrl) ||
                        "https://placeimg.com/500/500"
                    }
                    alt="user-icon"
                />
            </div>
            <div className="feed_post-info">
                <div className="feed_post-info-icons">
                    <FaRegHeart className="post-icon" />
                    <FaRegCommentDots className="post-icon" />
                </div>
                <div className="feed_post-info-comments">
                    <p className="info-likes">{post.likingUsers.length} likes</p>
                    <div className="info-caption">
                        <Link to={`/${post.user.username}`}>
                            <div className="caption-user">{post.user.username}</div>
                        </Link>

                        <div className="post-caption">
                            <Editor
                                editorState={editorState}
                                readOnly={true}
                                plugins={plugins}
                                onChange={(editorState) => setEditorState(editorState)}
                            />
                        </div>
                    </div>
                    <div className="post-comments-container">
                        {post.comments &&
                            post.comments.map((comment) => {
                                return <Comment comment={comment} />;
                            })}
                    </div>
                    <div className="post-new-comment">
                        <CommentInput post={post} />
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Post;
