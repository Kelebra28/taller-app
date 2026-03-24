import clsx from "clsx";
export { clsx };
export function isoToday(){ return new Date().toISOString().slice(0,10); }
export function displayOrderNo(orderNo:number){ return Math.max(0, (orderNo||1)-1); }
