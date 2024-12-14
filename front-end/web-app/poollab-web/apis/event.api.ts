import { EventResponse } from "@/utils/types/event.types";


export const EventApi = {
  getAllEvents: async (): Promise<EventResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/event/getallevent`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },
}