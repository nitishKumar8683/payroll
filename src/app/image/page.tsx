"use client"

import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";


export default function Image(){
  const [image , setImage] = useState<File | null>(null)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if(!image) {
        return
      }

      const formData = new FormData()
      formData.append("image" , image)

      const response = await axios.post("/api/users/imageUpload", formData);
      const data = await response.data
      console.log(data);
    } catch (error:any) {
      console.log(error.message)
    }
  }

    return (
      <main className="p-16 text-center">
        <h1 className="py-8 text-5xl font-medium">Image Upload</h1>
        <form onSubmit={onSubmitHandler} className="mx-auto w-1/2 py-10">
          <input onChange={onChangeHandler} type="file" name="" id="" />
          <button className="rounded-sm bg-black px-4 py-2 text-white">
            upload
          </button>
        </form>
      </main>
    );
}