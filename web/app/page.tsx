"use client";
import HomeLogOut from "@/components/home_logout";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const { logged } = useAuth();
  return <div>{logged ? <Home /> : <HomeLogOut />}</div>;
}
