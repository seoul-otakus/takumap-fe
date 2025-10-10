// Kakao Maps API 타입 정의

export interface KakaoMaps {
  maps: {
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Map: new (container: HTMLElement, options: MapOptions) => KakaoMap;
    Marker: new (options: MarkerOptions) => KakaoMarker;
    InfoWindow: new (options: InfoWindowOptions) => KakaoInfoWindow;
    event: {
      addListener: (target: KakaoMap | KakaoMarker, type: string, handler: () => void) => void;
    };
    load: (callback: () => void) => void;
  };
}

export interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

export interface MapOptions {
  center: KakaoLatLng;
  level: number;
}

export interface MarkerOptions {
  position: KakaoLatLng;
  title: string;
}

export interface InfoWindowOptions {
  content: string;
}

export interface KakaoMap {
  setCenter: (position: KakaoLatLng) => void;
  getLevel: () => number;
  setLevel: (level: number) => void;
}

export interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
  getPosition: () => KakaoLatLng;
}

export interface KakaoInfoWindow {
  open: (map: KakaoMap, marker: KakaoMarker) => void;
  close: () => void;
}

declare global {
  interface Window {
    kakao: KakaoMaps;
  }
}
