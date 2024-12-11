"use client"
import Main from "./ui/Main";
import { useEffect, useState } from "react";
import { IEventsState, useEventStore } from "./zustand/events";
import { ICategoriesState, useCategoriesState } from "./zustand/categories";
import LoadingPage from "./ui/LandingPage";
import Events from "./ui/Events";
import EventsFeatured from "./ui/EventsFeatured";
import MailBox from "./ui/MainBox";
import Auth from "./ui/Auth";
import Categories from "./ui/Categories";

export default function Home() {

  const [openAuth, setOpenAuth] = useState<boolean>(false);
  const [openCategories, setOpenCategories] = useState<boolean>(true);
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState<boolean>(true);
  const { getEvents }: IEventsState = useEventStore();
  const { getCategoriesCount }: ICategoriesState = useCategoriesState();

  useEffect(() => {
    window?.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getEvents(limit);  // Pasamos el límite actual
  }, [limit]);


  useEffect(() => {
    getCategoriesCount();
  }, [])

  const hasVisited = localStorage.getItem("hasVisited");
  const selectedCategories = localStorage.getItem("selectedCategories");

  useEffect(() => {
    if (hasVisited) {
      setLoading(false);
    } else {
      localStorage.setItem("hasVisited", "true");
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);  // Ajusta el tiempo según tus necesidades
      return () => clearTimeout(timer);
    }
  }, [hasVisited]);



  useEffect(() => {
    const isVisited = localStorage.getItem('hasVisited');
    if (isVisited) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 2500);
    }
  }, []); // Se ejecuta cada vez que se carga la página

  console.log(hasVisited)

  if (loading === true && !hasVisited) {
    return <LoadingPage />;
  }

  // if (loading === true && hasVisited) {
  //   return <Loading />;
  // }

  return (
    <div>
      <div>
        { hasVisited && selectedCategories === null && <Categories setOpenCategories={setOpenCategories} openCategories={openCategories} /> }
        <Main />
        <EventsFeatured setOpenAuth={setOpenAuth} />
        <Events setOpenAuth={setOpenAuth} />
        <MailBox />
      </div>
      <Auth openAuth={openAuth} setOpenAuth={setOpenAuth} />
    </div>
  );
}
