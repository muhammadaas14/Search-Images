import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Images.css";
const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = "n8AlNKDiwAfenWJ8whls4ForkRvMLZ2v33AnaaWWyXI";
const images_per_page = 25;

export default function Images() {
  const [images, setImages] = useState([]);
  const [user, setuser] = useState(null);
  const [page, setpage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const searchinput = useRef(null);
  const [errormsg, setErrormsg] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchedimages = async () => {
    try {
      setErrormsg("");
      const { data } = await axios.get(
        `${API_URL}?query=${searchinput.current.value}&page=${page}&per_page=${images_per_page}&client_id=${API_KEY}`
      );
      setImages(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.log(error);
      setErrormsg("Error Fetching Images. Try Again Later");
    }
  };

  const handlesearch = (e) => {
    e.preventDefault();
    fetchedimages();
    setpage(1);
  };

  const handleselection = (selection) => {
    searchinput.current.value = selection;
    fetchedimages();
    setpage(1);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    fetchedimages();
  }, [page]);

  console.log("page", page);

  return (
    <div className="container">
      <div className="Header">Search Images</div>
      {errormsg && <p className="error-msg">{errormsg}</p>}
      <form onSubmit={handlesearch}>
        <input ref={searchinput} className="form-control"></input>
      </form>

      <div
        onClick={() => handleselection("Nature")}
        className="btn btn-primary"
      >
        Nature
      </div>

      <div
        onClick={() => handleselection("Shoes")}
        style={{ margin: "2rem" }}
        className="btn btn-primary"
      >
        Shoes
      </div>

      <div onClick={() => handleselection("Cats")} className="btn btn-primary">
        Cats
      </div>

      <div
        onClick={() => handleselection("Landscapes")}
        style={{ margin: "2rem" }}
        className="btn btn-primary"
      >
        Landscapes
      </div>
      {selectedImage && (
        <div className="image-modal">
          <div className="modal-content">
            <span className="close" onClick={closeImageModal}>
              &times;
            </span>
            <img
              className="img-modal"
              src={selectedImage.urls.full}
              alt={selectedImage.alt_description}
            />
            <div>
              <p className="paragraph1">📷: {selectedImage.user.name}</p>
              <p className="paragraph1">
                {selectedImage.user.total_likes ? (
                  <p
                    href={selectedImage.user.total_likes}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ❤️️:
                    {selectedImage.user.total_likes}
                  </p>
                ) : (
                  "N/A"
                )}
              </p>
              <p className="paragraph1">
                Visit Us:{" "}
                {selectedImage.user.portfolio_url ? (
                  <a
                    href={selectedImage.user.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedImage.user.portfolio_url}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <br></br>
              <p className="paragraph1">
                ⭳:{" "}
                {selectedImage.links.download ? (
                  <a
                    href={selectedImage.links.download}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedImage.links.download}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="images">
        {images.map((Image) => {
          return (
            <div key={Image.id} onClick={() => openImageModal(Image)}>
              <img
                className="image"
                key={Image.id}
                src={Image.urls.small}
                alt={Image.alt_description}
              ></img>
              <div>
                <p className="paragraph">📸: {Image.user.name}</p>
                <p className="paragraph">❤️️: {Image.user.total_likes}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="buttons">
        {page > 1 && (
          <button className="btn btn-primary" onClick={() => setpage(page - 1)}>
            Previous
          </button>
        )}
        {page < totalPages && (
          <button className="btn btn-primary" onClick={() => setpage(page + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
