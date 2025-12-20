"use client";

import Main from "./ui/Main";
import { useEffect, useState } from "react";
import { IEventsState, useEventStore } from "./zustand/events";
import { ICategoriesState, useCategoriesState } from "./zustand/categories";
import LoadingPage from "./ui/LandingPage";
import Events from "./ui/Events";
import EventsFeatured from "./ui/EventsFeatured";
// import MailBox from "./ui/MainBox";
// import Auth from "./ui/Auth";
import Categories from "./ui/Categories";
import dynamic from "next/dynamic";

const Auth = dynamic(() => import("./ui/Auth"), { ssr: false });
const MailBox = dynamic(() => import("./ui/MainBox"));

export default function Home() {
  const [openAuth, setOpenAuth] = useState<boolean>(false);
  const [openCategories, setOpenCategories] = useState<boolean>(false); // Inicializamos en falso
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasVisited, setHasVisited] = useState<boolean | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string | null>(null);

  const { getEvents, getEventsDestacades }: IEventsState = useEventStore();
  const { getCategoriesCount }: ICategoriesState = useCategoriesState();

  useEffect(() => {
    window?.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getEvents(limit); // Pasamos el límite actual
    getEventsDestacades();
  }, [limit]);

  useEffect(() => {
    getCategoriesCount();
  }, []);

  useEffect(() => {
    // Accede a localStorage solo en el cliente
    const visited = localStorage.getItem("hasVisited");
    const categories = localStorage.getItem("selectedCategories");

    setHasVisited(visited ? true : false);
    setSelectedCategories(categories);

    // Configuramos openCategories si no hay categorías seleccionadas
    if (!categories) {
      setOpenCategories(true);
    }
  }, []);

  // useEffect(() => {
  //   if (hasVisited === false) {
  //     localStorage.setItem("hasVisited", "true");
  //     localStorage.setItem("selectedCategories", "[]");
  //     const timer = setTimeout(() => {
  //       setLoading(false);
  //     }, 2000); // Ajusta el tiempo según tus necesidades
  //     return () => clearTimeout(timer);
  //   }
  // }, [hasVisited]);

  useEffect(() => {
    if (hasVisited) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    }
  }, [hasVisited]); // Se ejecuta cada vez que `hasVisited` cambia

  if (loading && selectedCategories?.length === 0) {
    return <LoadingPage />;
  }

  return (
    <div>
      <div>
        {openCategories && (
          <Categories
            setOpenCategories={setOpenCategories}
            openCategories={openCategories}
          />
        )}
        <Main />
        <EventsFeatured setOpenAuth={setOpenAuth} />
        <Events setLimit={setLimit} setOpenAuth={setOpenAuth} />
        <MailBox />
      </div>
      <Auth openAuth={openAuth} setOpenAuth={setOpenAuth} />
    </div>
  );
}
