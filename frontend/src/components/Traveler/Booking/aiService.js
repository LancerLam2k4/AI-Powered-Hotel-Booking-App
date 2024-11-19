// aiService.js
const BASE_URL = 'http://localhost:5000'; // URL của Flask API

export async function askAI(question) {
  try {
    const currentID = require('../../Authentication/currentID.json'); // Lấy user_id từ tệp JSON
    const response = await fetch(`${BASE_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, user_id: currentID.user_id }),
    });
    const data = await response.json();
    return data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return { error: 'Có lỗi xảy ra khi kết nối với máy chủ AI.' };
  }
}
