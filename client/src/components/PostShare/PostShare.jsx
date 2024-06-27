import React, {useState, useRef} from 'react';
import ProfileImage from '../../img/profileImg.jpg'
import  './PostShare.css'
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useSelector, useDispatch } from 'react-redux';
import { uploadImage, uploadPost } from '../../actions/uploadAction';


const PostShare = () => {
    const loading  = useSelector((state)=>state.postReducer.uploading)
    const [image, setImage] = useState(null);
    const imageRef = useRef();
    const desc = useRef();
    const {user} = useSelector((state)=>state.authReducer.authData)
    const dispatch = useDispatch();
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    const onImageChange =(event)=>{
        if(event.target.files && event.target.files[0]){
            let img = event.target.files[0];
            setImage(img)

            
        }

    };

    const reset =()=>{
        setImage(null);
        desc.current.value="";
    }

    const handleSubmit = async(e)=> {
        e.preventDefault();

        const newPost = {
            userId : user._id,
            desc : desc.current.value,
        };
        if(image){
            const data = new FormData();
            const fileName = Date.now() + image.name;
            data.append("name", fileName)
            data.append("file", image)
            newPost.image = fileName
            console.log(newPost)
            try {
                await dispatch(uploadImage(data))
                await dispatch(uploadPost(newPost))
                reset();
            } catch (error) {
                console.log(error)
            }
        }else{
            try {
                await dispatch(uploadPost(newPost))
                reset();
            } catch (error) {
                
            }

        }
        
        
    }

  return (
    <div className="PostShare">
        <img src={user.profilePicture? serverPublic+user.profilePicture: serverPublic+"defaultProfile.png"} alt="" />
        <div>
            <input 
            
            type='text' 
            placeholder="What's happening...."
            required
            ref ={desc} />

            <div className='postOptions'>
            <div className="option" style={{color: "var(--photo)"}} 
            onClick={()=>imageRef.current.click()}>
                <UilScenery/>
                Photo
            </div>
            <div className="option" style={{color: "var(--video)"}}>
                <UilPlayCircle/>
                Video
            </div>
            <div className="option" style={{color: "var(--location)"}}>
                <UilLocationPoint/>
                Location
            </div>
            <div className="option" style={{color: "var(--shedule)"}}>
                <UilSchedule/>
                Time
            </div>
            <button className='button ps-button' disabled={loading} 
            onClick={handleSubmit} >
                {loading? "uploading.." : "Share"}
            </button>

            <div style={{display: 'none'}}>
                <input type="file" name='myImage' ref={imageRef} onChange={onImageChange} />
            </div>
            
        </div>
        {image &&(
            <div className="previewImage">
                <UilTimes onClick={()=>setImage(null)}/>
                <img src={URL.createObjectURL(image)} alt="" />
            </div>
        )

        }

        </div>
        

    </div>
  )
}

export default PostShare;