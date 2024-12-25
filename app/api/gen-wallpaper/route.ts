import { insertWallpaper } from "@/models/wallpaper";
import { getOpenAIClient } from "@/service/openai";
import { saveUser } from "@/service/user";
import { User } from "@/types/user";
import { Wallpaper } from "@/types/wallpaper";
import { currentUser } from "@clerk/nextjs/server";
import { ImageGenerateParams } from "openai/resources/images.mjs";

export async function POST(req: Request) {
  const { discription } = await req.json();

  //当前用户
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return Response.json({
      code: -2,
      message: "user not login",
    });
  }

  //获取用户email
  const user_email = user.emailAddresses[0].emailAddress;

  //获取用户头像和昵称
  const nickname = user.firstName;
  const avatarUrl = user.imageUrl;

  const userInfo: User = {
    email: user_email,
    nickname: nickname || "",
    avatar_url: avatarUrl,
  };
  //用户信息入库
  await saveUser(userInfo);

  const client = getOpenAIClient();

  const img_size = "1792x1024";
  const llm_name = "black-forest-labs/FLUX.1-dev";
  const llm_params: ImageGenerateParams = {
    prompt: discription,
    model: llm_name,
    n: 1,
    quality: "hd",
    response_format: "url",
    size: img_size,
    style: "natural",
  };
  const result = await client.images.generate(llm_params);

  const created_at = new Date().toISOString();
  const wallpaper: Wallpaper = {
    user_email: user_email,
    img_description: discription,
    img_size: img_size,
    img_url: result.data[0].url || "",
    llm_name: llm_name,
    llm_params: JSON.stringify(llm_params),
    created_at: created_at,
    user_avatar: avatarUrl,
    user_nickname: nickname?.toString(),
  };

  await insertWallpaper(wallpaper);

  return Response.json({
    code: 0,
    message: "ok",
    data: wallpaper,
  });
}
