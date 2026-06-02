import api from "./api";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export const travelService = {
  destinations: () => api.get("/travel/destinations").then((res) => res.data),
  recommendations: (payload) => api.post("/travel/recommendations", payload).then((res) => res.data),
  itinerary: (payload) => api.post("/travel/itinerary", payload).then((res) => res.data),
  chat: (payload) => api.post("/travel/chat", payload).then((res) => res.data),
  streamChat: async (payload, handlers = {}) => {
    const response = await fetch(`${API_BASE}/travel/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("travel_token")
          ? { Authorization: `Bearer ${localStorage.getItem("travel_token")}` }
          : {})
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok || !response.body) {
      throw new Error("Streaming request failed");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    function flushEvent(rawEvent) {
      const lines = rawEvent.split("\n");
      const eventName = lines.find((line) => line.startsWith("event:"))?.replace("event:", "").trim() || "message";
      const dataLine = lines.find((line) => line.startsWith("data:"));
      if (!dataLine) return;
      const data = JSON.parse(dataLine.replace("data:", "").trim());

      if (eventName === "meta") handlers.onMeta?.(data);
      if (eventName === "delta") handlers.onDelta?.(data.text || "");
      if (eventName === "done") handlers.onDone?.(data);
      if (eventName === "error") handlers.onError?.(data);
    }

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() || "";
      events.forEach(flushEvent);
    }

    if (buffer.trim()) {
      flushEvent(buffer);
    }
  },
  hotels: (destinationId, payload) => api.post(`/travel/hotels/${destinationId}`, payload).then((res) => res.data),
  hiddenGems: (destinationId) => api.get(`/travel/hidden-gems/${destinationId}`).then((res) => res.data),
  weather: (destinationId) => api.get(`/travel/weather/${destinationId}`).then((res) => res.data),
  reviews: (destinationId) => api.get(`/travel/reviews/${destinationId}`).then((res) => res.data),
  budget: (destinationId, payload) => api.post(`/travel/budget/${destinationId}`, payload).then((res) => res.data),
  crowd: (destinationId, payload) => api.post(`/travel/crowd/${destinationId}`, payload).then((res) => res.data),
  maps: (payload) => api.post("/travel/maps", payload).then((res) => res.data),
  saveTrip: (payload) => api.post("/travel/save-trip", payload).then((res) => res.data)
};
