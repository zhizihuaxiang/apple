import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { Wallpaper } from "@/types/wallpaper";

interface Props {
  wallpapers: Wallpaper[];
}
export default function ({ wallpapers }: Props) {
  // 用一个对象来存储每个图标的状态
  const [likedImages, setLikedImages] = React.useState<{
    [key: number]: boolean;
  }>({});

  const handleToggleColor = (id: number) => {
    // 切换对应 id 的状态
    setLikedImages((prev) => ({
      ...prev,
      [id]: !prev[id], // 如果当前 id 是 true，切换为 false；反之亦然
    }));
  };
  return (
    <>
      {wallpapers &&
        wallpapers.map((wallpapers: Wallpaper, idx: number) => {
          return (
            <Box key={idx} sx={{ minHeight: 350 }}>
              <Card
                variant="outlined"
                sx={(theme) => ({
                  width: 300,
                  gridColumn: "span 2",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  resize: "horizontal",
                  overflow: "hidden",
                  gap: "clamp(0px, (100% - 360px + 32px) * 999, 16px)",
                  transition: "transform 0.3s, border 0.3s",
                  "&:hover": {
                    borderColor: theme.vars.palette.primary.outlinedHoverBorder,
                    transform: "translateY(-2px)",
                  },
                  "& > *": {
                    minWidth: "clamp(0px, (360px - 100%) * 999,100%)",
                  },
                })}
              >
                <AspectRatio
                  variant="soft"
                  sx={{
                    flexGrow: 1,
                    display: "contents",
                    "--AspectRatio-paddingBottom":
                      "clamp(0px, (100% - 360px) * 999, min(calc(100% / (16 / 9)), 300px))",
                  }}
                >
                  <img src={wallpapers.img_url} loading="lazy" alt="" />
                </AspectRatio>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    maxWidth: 200,
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <div>
                      <Typography level="title-lg">
                        <Link
                          href="#container-responsive"
                          overlay
                          underline="none"
                          sx={{
                            color: "text.primary",
                            "&.Mui-focusVisible:after": {
                              outlineOffset: "-4px",
                            },
                          }}
                        >
                          {wallpapers.img_description}
                        </Link>
                      </Typography>
                      {/* <div className="flex ml-[180px]">
                      </div> */}
                      {/* <Typography level="body-sm">点赞</Typography> */}
                    </div>
                    {/* IconButton点赞 */}
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="neutral"
                      sx={{ ml: "auto", alignSelf: "flex-start" }}
                      onClick={() => handleToggleColor(wallpapers.id!)}
                    >
                      <FavoriteBorderRoundedIcon
                        sx={{
                          color: likedImages[wallpapers.id!] ? "red" : "black",
                        }} // 根据状态动态设置颜色
                      />
                    </IconButton>
                  </Box>
                  <AspectRatio
                    variant="soft"
                    sx={{
                      "--AspectRatio-paddingBottom":
                        "clamp(0px, (100% - 200px) * 999, 200px)",
                      pointerEvents: "none",
                    }}
                  >
                    <img alt="" src={wallpapers.img_url} />
                  </AspectRatio>
                  <Box sx={{ display: "flex", gap: 1.5, mt: "auto" }}>
                    {/* 头像 */}
                    <Avatar>
                      <img alt="" src={wallpapers.created_user?.avatar_url} />
                    </Avatar>
                    <div>
                      {/* <Typography level="body-xs">作者：</Typography> */}
                      <Typography level="body-sm">
                        {wallpapers.created_user?.nickname}
                      </Typography>
                    </div>
                  </Box>
                </Box>
              </Card>
            </Box>
          );
        })}
    </>
  );
}
