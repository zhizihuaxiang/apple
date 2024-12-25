import React, { Dispatch, SetStateAction, useState } from "react";
import { Input, Toast } from "@douyinfe/semi-ui";
import { Wallpaper } from "@/types/wallpaper";
import { useUser } from "@clerk/nextjs";

interface Props {
  setWallpapers: Dispatch<SetStateAction<Wallpaper[]>>;
}

export default function ({ setWallpapers }: Props) {
  const { isSignedIn } = useUser(); // 检查是否已登录

  //输入框内容
  const [description, setDiscription] = useState("");

  //按钮加载状态
  const [loading1, setLoading1] = useState(false);

  const generateWallpaper = async function () {
    try {
      setLoading1(true);
      const discription = {
        discription: description,
      };
      const result = await fetch("api/gen-wallpaper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discription),
      });
      const { data } = await result.json();
      if (data) {
        const wallpaper = data;
        setWallpapers((wallpapers: Wallpaper[]) => [wallpaper, ...wallpapers]);
      }
    } catch (e) {
    } finally {
      setLoading1(false); // 无论成功还是失败都设置为 false
    }
  };

  const handlesubmit = async () => {
    if (!description) {
      alert("请输入关键词");
      return;
    }

    if (!isSignedIn) {
      return alert("请先登录");
    }

    await generateWallpaper();
    setDiscription("");
  };
  //点击按钮加载状态
  return (
    <div className="flex">
      <input
        disabled={loading1}
        type="text"
        placeholder="输入你的描述"
        className="input input-bordered input-accent w-[320px] max-w-xs "
        value={description}
        onChange={(e) => setDiscription(e.target.value)}
      />
      {loading1 ? (
        <div className="flex ml-6">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : (
        <button
          className="btn btn-outline flex ml-6 btn-accent"
          onClick={handlesubmit}
        >
          生成
        </button>
      )}
    </div>
  );
}
