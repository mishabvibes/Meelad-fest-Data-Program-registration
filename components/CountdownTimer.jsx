"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer({ deadline, onExpire }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    if (!deadline) return;

    const targetDate = new Date(deadline).getTime();
    
    // Initial check
    const distance = targetDate - new Date().getTime();
    if (distance <= 0) {
       setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
       if (onExpire) onExpire();
       return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const dist = targetDate - now;

      if (dist <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        if (onExpire) onExpire();
      } else {
        setTimeLeft({
          days: Math.floor(dist / (1000 * 60 * 60 * 24)),
          hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((dist % (1000 * 60)) / 1000),
          expired: false,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, onExpire]);

  if (!deadline) return null;
  if (timeLeft.expired) return null;

  return (
    <div className="mb-6 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-center shadow-inner">
      <p className="mb-2 text-[12px] font-bold uppercase tracking-widest text-gold drop-shadow-sm">
        രജിസ്ട്രേഷൻ അവസാനിക്കാൻ
      </p>
      <div className="flex justify-center gap-4 text-night">
        <TimeBox value={timeLeft.days} label="ദിവസം" />
        <TimeBox value={timeLeft.hours} label="മണിക്കൂർ" />
        <TimeBox value={timeLeft.minutes} label="മിനിറ്റ്" />
        <TimeBox value={timeLeft.seconds} label="സെക്കന്റ്" />
      </div>
    </div>
  );
}

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-soft">
        <span className="font-display text-xl font-bold leading-none">{value.toString().padStart(2, "0")}</span>
      </div>
      <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-ink/60">{label}</span>
    </div>
  );
}
