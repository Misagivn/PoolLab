import { Event, EventResponse } from "@/utils/types/event.types";

const BASE_URL = 'https://poollabwebapi20241008201316.azurewebsites.net/api';

export const eventApi = {
  getAllEvents: async (page: number = 1, pageSize: number = 10): Promise<EventResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/event/getallevent?SortBy=createdDate&SortAscending=false&PageNumber=${page}&PageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  },

  createEvent: async (data: Omit<Event, 'id' | 'username' | 'fullName' | 'storeName' | 'address' | 'createdDate' | 'updatedDate' | 'status'>): Promise<EventResponse> => {
    const token = localStorage.getItem('token');
    
    const formatDateTime = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString('sv-SE').replace(' ', 'T');
    };

    const submitData = {
      title: data.title || "",
      descript: data.descript || "",
      thumbnail: data.thumbnail || "",
      managerId: data.managerId || "",
      storeId: null,
      timeStart: formatDateTime(data.timeStart),
      timeEnd: formatDateTime(data.timeEnd)
    };

    console.log('Submitting create data:', submitData);

    const response = await fetch(
      `${BASE_URL}/event/createnewevent`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      }
    );

    const result = await response.json();
    console.log('Create response:', result);
    return result;
  },
  
  uploadEventImage: async (formData: FormData): Promise<EventResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/event/uploadfileevent`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      }
    );
    
    if (!response.ok) {
      console.error('Upload error:', response.statusText);
      throw new Error('Upload failed');
    }
    
    const result = await response.json();
    console.log('Upload result:', result);
    return result;
  },

 
  updateEvent: async (eventId: string, data: Omit<Event, 'id' | 'username' | 'fullName' | 'storeName' | 'address' | 'createdDate' | 'updatedDate' | 'status'>): Promise<EventResponse> => {
    const token = localStorage.getItem('token');
    
    // Format ngày giờ theo yêu cầu API
    const formatDateTime = (dateStr: string) => {
      const date = new Date(dateStr);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60 * 1000));
      return localDate.toISOString().split('.')[0]; // Format: YYYY-MM-DDThh:mm:ss
    };
  
    const submitData = {
      title: data.title,
      descript: data.descript,
      thumbnail: data.thumbnail || "",
      managerId: data.managerId,
      storeId: null,
      timeStart: formatDateTime(data.timeStart),
      timeEnd: formatDateTime(data.timeEnd)
    };
  
    const response = await fetch(
      `${BASE_URL}/event/updateeventinfo/${eventId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      }
    );
    return response.json();
  },

  uploadEventImage: async (formData: FormData): Promise<EventResponse> => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${BASE_URL}/event/uploadfileevent`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Bỏ Content-Type để browser tự set với boundary
      },
      body: formData
    }
  );
  
  if (!response.ok) {
    console.error('Upload error:', response.statusText);
    throw new Error('Upload failed');
  }
  
  const result = await response.json();
  console.log('Upload result:', result);
  return result;
},



  deleteEvent: async (eventId: string): Promise<EventResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/event/deleteevent?id=${eventId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.json();
  }
};