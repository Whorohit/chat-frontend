import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Image, AudioFile, VideoFile, UploadFile } from '@mui/icons-material';
import { setIsFileMenu } from '../Redux/misc';
import { showSnackbar } from '../Redux/snackbarslice';
import { useSendattachmentMutation } from '../Redux/api';

const Filemenu = ({ anchorE1,chatId }) => {
    const dispatch = useDispatch();
    const ImageRef = useRef(null)
    const AudioRef = useRef(null)
    const VideoRef = useRef(null)
    const FileRef = useRef(null)
    const [sendAttachments] = useSendattachmentMutation();
    const { isFileMenu } = useSelector((state) => state.misc)
    const CloseFileMenu = () => {
        dispatch(setIsFileMenu(false))
    }
    const selectImage = () => ImageRef.current?.click();
    const selectVideo = () => VideoRef.current?.click();
    const selectAudio = () => AudioRef.current?.click();
    const selectFile = () => FileRef.current?.click();
    const FilechangeHandler = async (e, key) => {
        const files = Array.from(e.target.files)
        if (files.length <= 0) {
            return
        }
        if (files.length >= 5) {
            dispatch(showSnackbar({
                message:`  maximum file size is 5  `,
                severity: "error"
            }))
        
        }
        // dispatch(setUploadingLoader(true))
        dispatch(showSnackbar({
            message:'Loading',
            severity: "success"
        }))
    
        CloseFileMenu()
        try {
            const myForm = new FormData()
            myForm.append("chatId",chatId)
            files.forEach((file)=>{
                myForm.append("files",file)
            })
            const res = await sendAttachments(myForm)
            if (res.data) {
                dispatch(showSnackbar({
                    message:'send successfully',
                    severity: "success"
                }))
            }
            else {
                dispatch(showSnackbar({
                    message:` faild to send ${key } `,
                    severity: "error"
                }))
            
            }
        } catch (error) {
            dispatch(showSnackbar({
                message:` ${error} `,
                severity: "error"
            }))
            
        }
        finally {
             
        }


    }
    return (
        <Menu anchorEl={anchorE1} open={isFileMenu} onClose={CloseFileMenu}>
            <div style={{
                width: "10rem"
            }}>
                <MenuList>

                    <MenuItem onClick={selectImage}>
                        <Tooltip title="Image">
                            <Image />
                        </Tooltip>

                        <ListItemText style={{ marginLeft: ".5rem" }}>Image
                        </ListItemText>
                        <input type='file' multiple accept='image/png, image/jpeg image/gif' style={{ display: "none" }}
                            onChange={(e) => {
                                FilechangeHandler(e, "Images")
                            }}
                            ref={ImageRef}
                        />
                    </MenuItem>


                    <MenuItem onClick={selectAudio}>
                        <Tooltip title="Audio">
                            <AudioFile />
                        </Tooltip>

                        <ListItemText style={{ marginLeft: ".5rem" }}>Audio
                        </ListItemText>
                        <input type='file' multiple accept='audio/mpeg, audio/wav audio/' style={{ display: "none" }}
                            onChange={(e) => {
                                FilechangeHandler(e, "Audios")
                            }}
                            ref={AudioRef} />
                    </MenuItem>

                    <MenuItem onClick={selectVideo} >
                        <Tooltip title="Video">
                            <VideoFile />
                        </Tooltip>

                        <ListItemText style={{ marginLeft: ".5rem" }}>Video
                        </ListItemText>
                        <input type='file' multiple accept='video/mp4, audio/webm,  video/ogg' style={{ display: "none" }}
                            onChange={(e) => {
                                FilechangeHandler(e, "Audios")
                            }}
                            ref={VideoRef} />
                    </MenuItem>

                    <MenuItem onClick={selectFile}>
                        <Tooltip title="File">
                            <UploadFile />
                        </Tooltip>

                        <ListItemText style={{ marginLeft: ".5rem" }}>upload File
                        </ListItemText>
                        <input type='file' multiple accept='*' style={{ display: "none" }}
                            onChange={(e) => {
                                FilechangeHandler(e, "Files")
                            }}
                            ref={FileRef} />
                    </MenuItem>
                </MenuList>
            </div>
        </Menu>
    )
}

export default Filemenu
