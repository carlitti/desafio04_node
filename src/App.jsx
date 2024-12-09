import axios from "axios";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import Post from "./components/Post";

const API_URL = "http://localhost:3000/posts"; 

function App() {
  const [titulo, setTitulo] = useState("");
  const [imgSrc, setImgSRC] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [posts, setPosts] = useState([]);

 
  const getPosts = async () => {
    try {
      const { data: posts } = await axios.get(API_URL);
      setPosts(posts);
    } catch (error) {
      console.error("Error al obtener los posts:", error);
    }
  };


  const agregarPost = async () => {
    try {
      const post = { titulo, url: imgSrc, descripcion };
      await axios.post(API_URL, post);
      getPosts();
    } catch (error) {
      console.error("Error al agregar el post:", error);
    }
  };

  const like = async (id) => {
    try {
      const post = posts.find((p) => p.id === id); 
      await axios.put(`${API_URL}/${id}`, { likes: post.likes + 1 }); 
      getPosts();
    } catch (error) {
      console.error("Error al incrementar los likes:", error);
    }
  };


  const eliminarPost = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      getPosts();
    } catch (error) {
      console.error("Error al eliminar el post:", error);
    }
  };


  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="App">
      <h2 className="py-5 text-center">&#128248; Like Me &#128248;</h2>
      <div className="row m-auto px-5">

        <div className="col-12 col-sm-4">
          <Form
            setTitulo={setTitulo}
            setImgSRC={setImgSRC}
            setDescripcion={setDescripcion}
            agregarPost={agregarPost}
          />
        </div>
        <div className="col-12 col-sm-8 px-5 row posts align-items-start">
          {posts.map((post, i) => (
            <Post
              key={i}
              post={post}
              like={like} 
              eliminarPost={eliminarPost} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
