import { ICategoriesState, useCategoriesState } from "@/app/zustand/categories";
import Slide from "./Slide";
import { useEffect } from "react";

const RelatedEvents = ({ data }: any) => {

    const { getCategoriesRelations, categoriesRelations }: ICategoriesState = useCategoriesState();

    useEffect(() => {
        if (data.length > 0) {
            // Pass the Event ID to fetch related events by this event
            getCategoriesRelations(data[0]?.ideventos);
        }
    }, [])

    return (
        <>
            {
                categoriesRelations?.length > 0 && (
                    <div className="px-2">
                        <h3 className="font-[Quicksand] font-bold text-xl mb-6 mt-6 px-3">Te pueden interesar estos otros eventos</h3>
                        <Slide categoriesRelations={categoriesRelations} />
                    </div>
                )
            }
        </>
    )
}

export default RelatedEvents;