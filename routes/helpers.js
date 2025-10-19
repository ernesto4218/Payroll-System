import bcrypt from 'bcrypt';
import ProfileImage from './profile-generator.js';

export async function hashPassword(plainPassword) {
  const saltRounds = 10; 
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

export async function generateAuthToken(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

export function generateRandomCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Manila'
  });
}

function getRandomDarkColor() {
  // Generate RGB components with low values (0 to 100) to ensure dark colors
  const r = Math.floor(Math.random() * 100);
  const g = Math.floor(Math.random() * 100);
  const b = Math.floor(Math.random() * 100);
  return `rgb(${r}, ${g}, ${b})`;
}


export function generateprofile(fullname){
  const image = new ProfileImage(fullname.toUpperCase(), {
    backgroundColor: getRandomDarkColor(),
    textColor: "white",
    fontWeight: "bold"
  });

  return image
}


