import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [edittitle,editsetTitle] = useState('');
  const [editdescription,editsetdescription] = useState('');
  const [title,setTitle] = useState('');
  const [description,setdescription] = useState('');
  const [todos , settodo] = useState([])
  const [editid,seteditid] = useState(-1)
  const [error,seterror]=useState('')
    const [message,setmessage]=useState('')
  
  const funsubmit = ()=>{
    seterror('')
     if ( title.trim() !== "" && description.trim() !== "" ){
        
        fetch('http://localhost:3000/todo',{

          method:"POST",
          headers :{
            'Content-type':"application/json"
          },
          body: JSON.stringify({title,description})

        }  )
        .then((res) => {
        if (res.ok) {
          setTitle('')
          setdescription('')
          setmessage("Successfully added!")
          seterror('')
          setTimeout( ()=> {setmessage("")},2000 )
          getitem()

        } else {
          seterror("Item not created")
          
        }
        console.log("hiii"+todos)
      })
      .catch((err) => {
        seterror("Item not created")
        console.error(err)
      });

        
        

     }
    
  }

  useEffect(()=>{
    getitem()
  },[])

  const getitem = () => {
    fetch('http://localhost:3000/todo')
    .then((res)=>{
      return res.json()
    })
    .then((res)=>{
      settodo(res)
    })

  }

  const updatedata = () =>{
     seterror('')
     if ( edittitle.trim() !== "" && editdescription.trim() !== "" ){
        
        fetch('http://localhost:3000/todo/'+editid,{

          method:"PUT",
          headers :{
            'Content-type':"application/json"
          },
          body: JSON.stringify({title:edittitle,description:editdescription})

        }  )
        .then((res) => {
        if (res.ok) {
          const updatetodo = todos.map((item) => {
          if (item._id === editid) {
              return { ...item, title: edittitle, description: editdescription };
            }
            return item;
          });

          settodo(updatetodo)
          seteditid(-1)
          editsetTitle('');
          editsetdescription('');
          

        } else {
          seterror("Item not created")
          
        }
        console.log("hiii"+todos)
      })
      .catch((err) => {
        seterror("Item not created")
        console.error(err)
      });
     }
    
  }


  const Delete_item =(id)=>{
      if (window.confirm("confirm delete")){
          fetch('http://localhost:3000/todo/'+id, {
              method:"DELETE"
          }  )
          .then(() => {
             const update = todos.filter((item) => item._id!==id)
             settodo(update)
          })
      }
  }



  return (
    <>
    <div className="App">
       <h2>TODO PROJECT</h2>
    </div>
    <div className='row container-sm p-4 '>
      <div className='form-group d-flex gap-3 '>
       <input className='form-control' value={title}  onChange={(e)=>setTitle(e.target.value)}   placeholder='title' type='text'></input>
       <input className='form-control' value={description} onChange={(e)=>setdescription(e.target.value)}  placeholder='description' type='text'></input>
       <button className='btn btn-secondary'  onClick={funsubmit}>submit</button>
       
      </div>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <div>

      </div>
    </div>
    
    <div className='row mt-3 '>
      <ul className='list-group'>
        { todos.map((items,index)=>
        <li key ={index} className='list-group-item w-auto d-flex justify-content-between ms-4'>
        { (editid == -1 || editid !== items._id) ? <div className='d-flex flex-column'>   
        <span>{items.title}</span>
        <span>{items.description}</span>
        </div> : 
        <div className='form-group d-flex gap-3 '>
       <input className='form-control' value={edittitle}  onChange={(e)=>editsetTitle(e.target.value)}   placeholder='title' type='text'></input>
       <input className='form-control' value={editdescription} onChange={(e)=>editsetdescription(e.target.value)}  placeholder='description' type='text'></input>
        
      </div>  }
     
        <div className='d-flex gap-2' >
          { (editid == -1 || editid !== items._id )?<button className='btn btn-success' onClick={()=>{seteditid(items._id);editsetTitle(items.title); editsetdescription(items.description)}}>edit</button>  : <button className='btn btn-warning' onClick={updatedata}>update</button>}
          
          { (editid==-1  || editid !== items._id )
            ? <button className='btn btn-danger' onClick={ ()=> Delete_item(items._id)}>Delete</button>
            : <button className='btn btn-danger' onClick={ ()=> seteditid(-1)} >Cancel</button>
          }
       
          </div>
       </li>
        
        )  }
       
      </ul>

    </div>
   
    </>
    
  );
}

export default App;

