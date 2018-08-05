import React from 'react';
import Dropzone from 'react-dropzone';
import {connect} from 'react-redux'
import axios from 'axios';
import Dragtest from './dragtest';
import {fetchImages, updateImage} from './actions/images';

export class Moodboard extends React.Component {
    // constructor(props) {
    //   super(props)
    //   this.state = { 
    //     files: [] ,
    //     moodboardImages : [],
    //     allImages:{},
    //     imageIds:[]
        
    //   };
    // }

    //gets list of images as json object array from our server, add it to our state
    getImages(){
          fetch('http://localhost:9090/api/moodboards/1')
          .then(response =>{
           //console.log('RESPONSE JSON',response.json());
            return response.json();
          })
          .then(console.log('MY STATE PROPS', this.props, this.props.state));
    } 
    
    saveImage(){
      console.log('test Save');
      const updateObject={
        id:621,
        position: [
          100,
          100
        ],
        dimensions: [
          259,
          194
        ]
      };
       //const update = moodboardImages
      this.props.dispatch(updateImage(updateObject));

    }

    //LIFE CYCLE
    componentDidMount() {
     this.props.dispatch(fetchImages());
     //console.log('what is it', this.props);  
     // .then(([data]) => this.props.state.setState({ moodboardImages :data.images}));
    }
        
    //DROPZONE handler
    onDrop(files) {
      console.log(files);
        const uploaders = files.map(file => {
          // Initial FormData
          //https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData
          const formData = new FormData();
          formData.append('file', file);
          formData.append('moodboard_id',1)
          
          // Make an AJAX upload request using Axios 
          // return axios.post("http://localhost:9090/api/cloudinary", formData, {
          //   headers: { "X-Requested-With": "XMLHttpRequest" },
          // }).then(response => {  
          //   console.log(response);
          // })

          //using fetch insead of Axios library
         return fetch("http://localhost:9090/api/cloudinary",{
            method:'POST',
            headers: { "X-Requested-With": "XMLHttpRequest" },
            body:formData
          })
          .then(response => console.log(response) );
        });

        // Once all the files are uploaded 
        Promise
          .all(uploaders)
          .then(() => {
            this.props.dispatch(fetchImages());
            //console.log('MOODBORED IMAGES' + this.state.moodboardImages);
        });
    }


    getImage(imageId){
      const match = this.props.allImages[imageId];
      return match;
    }

    updateImage(imageId,xpos,ypos,width,height){
       // this.props.dispatch(updateImage());
       this.props.dispatch(updateImage(imageId,xpos,ypos,width,height));
      // console.log('going ot dispatch');

      }

    saveUploadImages(){

      console.log('Saving Images...');
    }

    render() {
      const imagesIds = this.props.allImages.imageIds;
      const images =  this.props.allImages;

      if(!this.props || imagesIds == undefined){
        return null; //You can change here to put a customized loading spinner 
      }
  
      return (
    
        <section>
          <div className="dropzone">
            <Dropzone disableClick={false} disablePreview={true} onDrop={this.onDrop.bind(this)}>
              <p>Try dropping some files here, or click to select files to upload.</p>
            </Dropzone>
          </div>
          <div><button onClick={()=> this.props.dispatch(updateImage(622))}>Save IMAGES</button></div>
          <aside>
            <h2>Dropped files</h2>
            <ul>
        
             {
              this.props.allImages.imageIds.map(imageId =>{
                // const index =  this.props.moodboardImages.indexOf(image);
               // return <li key={image.id}><img src={image.imageurl} /></li>
                 return  <Dragtest imageId={imageId} key={imageId} image={images[imageId]} dispatcher={(xpos,ypos,width,height)=>this.updateImage(imageId,xpos,ypos,width,height)}></Dragtest>
               })
              } 
              
            </ul>
          </aside>
        </section>
      );
    }
  }
  const mapStateToProps = state => ({
    allImages: state.images.allImages

});



  export default connect(mapStateToProps)(Moodboard);