"use client";

import Header from "@/components/header";
import { Wallpaper } from "@/types/wallpaper";
import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function page() {
  //页码数
  const [page, setPage] = useState(1);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  //判断是否有下一页
  const [hasNextPage, setHasNextPage] = useState(true); // 是否有下一页

  const fetchDate = async function (page: number) {
    const params = {
      page: page,
      limit: 20,
    };

    const resp = await fetch("api/get-wallpaper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    if (resp.ok) {
      const res = await resp.json();
      if (res.data) {
        setWallpapers(res.data);
        setHasNextPage(res.data.length >= params.limit); // 数据条数不足，说明没有下一页
      }
    }
  };

  useEffect(() => {
    fetchDate(page);
  }, [page]);

  // 分页处理函数
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    } else {
      alert("已经最后一页了");
    }
  };
  return (
    <div>
      <Header wallpapers={wallpapers} setWallpapers={setWallpapers} />
      <div className="join flex justify-center">
        <button onClick={handlePrevPage} className="join-item btn">
          «上一页
        </button>
        <button className="join-item btn">第{page}页</button>
        <button onClick={handleNextPage} className="join-item btn">
          下一页»
        </button>
      </div>
    </div>
  );
}
