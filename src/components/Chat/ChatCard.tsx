import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

interface Chat {
  name: string;
  role: string;
  image_url: string;
}

const ChatCard = () => {
  const [chatData, setChatData] = useState<Chat[]>([]);

  useEffect(() => {
    getChatUser();
  }, []);

  const getChatUser = async () => {
    try {
      const response = await axios.get("/api/chats/getUser");
      console.log(response);
      setChatData(response.data.usersData as Chat[]);
    } catch (error) {
      console.error("Error fetching chat users:", error);
    }
  };

  const chatUser = (e: any) => {
    e.preventDefault();
    alert("Working on it");
  };
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Chats
      </h4>

      <div>
        {chatData.map((chat, key) => (
          <Link
            href="/"
            className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
            onClick={chatUser}
          >
            <span className="h-16 w-16 overflow-hidden rounded-full">
              <div className="bg-gray-200 relative h-full w-full rounded-full">
                <Image
                  src={chat.image_url || "/images/cover/cover-01.png"}
                  alt="User"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </span>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {chat.name}
                </h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {chat.role}
                  </span>
                  {/* <span className="text-xs"> . {chat.time} min</span> */}
                </p>
              </div>
              {/* {chat.textCount !== 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">
                    {" "}
                    {chat.textCount}
                  </span>
                </div>
              )} */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
