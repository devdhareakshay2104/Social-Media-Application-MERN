import * as UploadApi from '../api/UploadRequest'
import { getTimelinePosts } from './PostAction'

export const uploadImage = (data) => async (dispatch) => {

    try {
        await UploadApi.uploadImage(data)
    } catch (error) {
        console.log(error)
    }
}


export const uploadPost = (data) => async (dispatch) => {
    dispatch({ type: 'UPLOAD_START' })
    try {
        const newPost = await UploadApi.uploadPost(data)
        dispatch({ type: 'UPLOAD_SUCCESS', data: newPost.data })
        // Refetch posts after uploading
        dispatch(getTimelinePosts(data.userId))
    } catch (error) {
        console.log(error)
        dispatch({ type: 'UPLOAD_FAIL' })
    }
}