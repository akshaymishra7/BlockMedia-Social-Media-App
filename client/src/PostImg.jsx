import React, { forwardRef } from "react";
import "./PostImg.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './avatar';
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PublishIcon from "@material-ui/icons/Publish";
import DeleteIcon from '@material-ui/icons/Delete';

const Post = forwardRef(
  ({link}) => {

    return (
      <div className="post">
        <div className="post__avatar">
          <Avatar
            style={{ width: '100px', height: '100px' }}
            avatarStyle='Circle'
            {...generateRandomAvatarOptions() }
          />
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                {"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}{" "}
              </h3>
            </div>
            <div className="post__headerDescription">
              <img src={link} width="250px" alt="" />
            </div>
          </div>
          <div className="post__footer">
            <ChatBubbleOutlineIcon fontSize="small" />
            <RepeatIcon fontSize="small" />
            <FavoriteBorderIcon fontSize="small" />
            <PublishIcon fontSize="small" />
            {/* {personal ? (
              <DeleteIcon fontSize="small" onClick={onClick}/>
            ) : ("")} */}
          </div>
        </div>
      </div>
    );
  }
);

export default Post;
