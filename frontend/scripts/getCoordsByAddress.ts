import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const envContent = readFileSync(envPath, "utf-8");
    const lines = envContent.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts.join("=");
        process.env[key.trim()] = value.trim();
      }
    }
  } catch (error) {
    console.error("⚠️  .env 파일을 찾을 수 없습니다.");
  }
}

loadEnv();

async function getCoordinatesByAddress(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_API_KEY;

  if (!apiKey) {
    console.log("❌ Kakao API 키가 설정되지 않았습니다.\n");
    console.log("💡 .env 파일에 다음을 추가하세요:");
    console.log("   NEXT_PUBLIC_KAKAO_API_KEY=your_api_key\n");
    console.log("API 키 발급: https://developers.kakao.com/");
    return null;
  }

  try {
    console.log(`🔍 주소 검색 중: "${address}"\n`);

    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
      address
    )}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const place = data.documents[0];
      const latitude = parseFloat(place.y); // Kakao API는 y=latitude
      const longitude = parseFloat(place.x); // x=longitude

      console.log("✅ 좌표를 찾았습니다!\n");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📫 주소: ${place.address_name}`);
      console.log(`📍 도로명: ${place.road_address?.address_name || "N/A"}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`\n📌 좌표:`);
      console.log(`   latitude: ${latitude},`);
      console.log(`   longitude: ${longitude},\n`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      return { latitude, longitude, address: place.address_name };
    } else {
      console.log("❌ 해당 주소를 찾을 수 없습니다.");
      console.log("💡 다른 검색어를 시도해보세요.\n");
      return null;
    }
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    return null;
  }
}

// CLI에서 실행
const address = process.argv[2];

if (!address) {
  console.log("❌ 주소를 입력해주세요.\n");
  console.log("사용법:");
  console.log('  npx tsx scripts/getCoordsByAddress.ts "주소"\n');
  console.log("예시:");
  console.log(
    '  npx tsx scripts/getCoordsByAddress.ts "서울 마포구 양화로 188"'
  );
  process.exit(1);
}

getCoordinatesByAddress(address);
