"use client";

import { useEffect } from "react";
import PhaserGame from "@/components/phasargame";
import { useGameStore } from "@/store/gamestore";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const streak = useGameStore((state) => state.streak);
  const [selected, setSelected] = useState("Today");
  const [completedActivities, setCompletedActivities] = useState(0);
  const date = new Date();
  const [history, setHistory] = useState<any[]>([]);

  function getSelectedDate() {
    //const date = new Date();

    if (selected === "Yesterday") {
      date.setDate(date.getDate() - 1);
    }

    if (selected === "Previous day") {
      date.setDate(date.getDate() - 2);
    }

    
    return date.toISOString().split("T")[0];
  }

  function getDate(daysAgo: number) {
    const date = new Date();

    date.setDate(date.getDate() - daysAgo);

    return date.toISOString().split("T")[0];
  }

  const [water, setWater] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2000);

  const [rest, setRest] = useState(0);
  const [restGoal, setRestGoal] = useState(8);

  const [exercise, setExercise] = useState(0);
  const [exerciseGoal, setExerciseGoal] = useState(45);

  function checkGoal(value: number, goal: number) {
    return value >= goal ? "✓" : "✗";
  }

  async function loadHistory() {
    const dates = [
      getDate(0),
      getDate(1),
      getDate(2),
    ];

    const results = await Promise.all(
      dates.map(async (date) => {
        const response = await fetch(`/api/day?date=${date}`);

        if (!response.ok) {
          console.error("Failed to load history");
          return null;
        }

        const data = await response.json();

        return {
          date,
          data,
        };
      })
    );

    setHistory(results);
  }

  async function saveDay(
    newWater: number,
    newRest: number,
    newExercise: number
  ) 
  {
    const response = await fetch("/api/day", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: getSelectedDate(),
        water: newWater,
        sleep: newRest,
        exercised: newExercise,
      }),
    });

    let CA = 0;

    if (newWater >= waterGoal) {
      CA++;
    }

    if (newRest >= restGoal) {
      CA++;
    }

    if (newExercise >= exerciseGoal) {
      CA++;
    }

    setCompletedActivities(CA);

    if (!response.ok) {
      console.error("Failed to save day");
    }

    await loadHistory();

  }

  useEffect(() => {
    async function loadStreak() {
      const response = await fetch("/api/login");

      if (!response.ok) {
        console.error("Failed to load streak");
        return;
      }

      const data = await response.json();

      useGameStore.setState({
        streak: data.streak,
      });
    }

    loadStreak();
    loadHistory();


    async function loadDay() { 
      const date = getSelectedDate();

      const response = await fetch(`/api/day?date=${date}`);

      if (!response.ok) {
        console.error("Failed to load day");
        return;
      }

      const data = await response.json();

      if (!data) {
        setWater(0);
        setRest(0);
        setExercise(0);
        return;
      }

      setWater(data.water);
      setRest(data.sleep);
      setExercise(data.exercised);
      setCompletedActivities(
        (data.water >= waterGoal ? 1 : 0) +
        (data.sleep >= restGoal ? 1 : 0) +
        (data.exercised >= exerciseGoal ? 1 : 0)
      );
    }

    loadDay();
  }, [selected]);

  async function handleLogin() {
    const response = await fetch("/api/login", {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Login API error:", error);
      return;
    }

    const data = await response.json();

    useGameStore.setState({
      streak: data.streak,
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 text-black">
      <div className="flex min-w-screen flex-col text-left bg-white">
        <p className="text-gray-400">
          Payuung Pribadi
        </p>        
        <h1 className="text-3xl font-semibold text-black">
          Daily Balance
        </h1>
        <p className="text-gray-400">
          Take care of your balance, one day at a time.
        </p>        
        <div className="mt-4 flex items-center gap-8">
          <button className="text-gray-400">
            Daily Balance
          </button>
          <button className="text-gray-400">
            Life777
          </button>
          <button className="text-gray-400">
            My Impact
          </button>
          <button className="text-gray-400">
            Achievements
          </button>
        </div>
      </div>
      
      <div className="flex min-w-screen flex-col text-left">
        <div className="mt-4 flex items-center gap-4"> 
        <p className="text-black">
          {selected}'s Balance
        </p>
        <p className="text-black">
          .
        </p>      
        <p className="text-black">
          #selected date time#
        </p>               
        </div>
        <div className="mt-4 flex items-center gap-4">

          <p className="text-gray-400">
            Select day:
          </p>

          <button
            onClick={() => setSelected("Today")}
            className={`rounded-full px-4 py-2 shadow-lg ${
              selected === "Today"
                ? "bg-darkgreen text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => setSelected("Yesterday")}
            className={`rounded-full px-4 py-2 shadow-lg ${
              selected === "Yesterday"
                ? "bg-darkgreen text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Yesterday
          </button>

          <button
            onClick={() => setSelected("Previous day")}
            className={`rounded-full px-4 py-2 shadow-lg ${
              selected === "Previous day"
                ? "bg-darkgreen text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Previous Day
          </button>  

        </div>
      </div>      
      <div className="self-start flex flex-row text-left gap-4 w-full items-start">
        <div className="self-start flex flex-col gap-4">

          <Card className="w-full rounded-3xl">
            <CardContent className="p-8">
              <p className="text-gray-400">
                {selected}'s progress
              </p>

              <h1 className="text-3xl font-semibold text-black">
                {completedActivities} out of 3 activities completed
              </h1>
            </CardContent>
          </Card>

          <div className="flex flex-row gap-4">
            <Card className="rounded-3xl">
              <CardContent className="p-8 gap-4 flex flex-col">
                <h1 className="text-3xl font-semibold text-black">
                  Water
                </h1>
                <Progress className="w-full" value={water} max={waterGoal}></Progress>
                <div className="flex flex-row gap-4 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => {
                      const newWater = Math.max(water - 50, 0);
                      setWater(newWater);
                      saveDay(newWater, rest, exercise);
                    }}
                    className="rounded-full bg-gray-200 px-4 py-2 text-black hover:bg-gray-300"
                  >
                    -
                  </button>
                  
                  <p className="text-black">
                    {water} ml
                  </p>
                  
                  <button
                    onClick={() => {
                      const newWater = Math.min(water + 50, waterGoal);
                      setWater(newWater);
                      saveDay(newWater, rest, exercise);
                    }}
                    className="rounded-full bg-gray-200 px-4 py-2 text-black hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardContent className="p-8 gap-4 flex flex-col">
                <h1 className="text-3xl font-semibold text-black">
                  Exercise
                </h1>
                <Progress className="w-full" value={exercise} max={exerciseGoal}></Progress>
                <div className="flex flex-row gap-4 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => {
                      const newExercise = Math.max(exercise - 5, 0);

                      setExercise(newExercise);
                      saveDay(water, rest, newExercise);
                    }}
                    className="rounded-full bg-gray-200 px-4 py-2 text-black hover:bg-gray-300"
                  >
                    -
                  </button>
                  
                  <p className="text-black">
                    {exercise} min
                  </p>
                  
                  <button
                    onClick={() => {
                      const newExercise = Math.min(exercise + 5, exerciseGoal);
                      setExercise(newExercise);
                      saveDay(water, rest, newExercise);
                    }}
                    className="rounded-full bg-gray-200 px-4 py-2 text-black hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardContent className="p-8 gap-4 flex flex-col">
                <h1 className="text-3xl font-semibold text-black">
                  Rest
                </h1>
                <Progress className="w-full" value={rest} max={restGoal}></Progress>
                <div className="flex flex-row gap-4 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => {
                      const newRest = Math.max(rest - 1, 0);
                      setRest(newRest);
                      saveDay(water, newRest, exercise);
                    }}
                    className="rounded-full bg-gray-200 px-4 py-2 text-black hover:bg-gray-300"
                  >
                    -
                  </button>
                  
                  <p className="text-black">
                    {rest} hours
                  </p>
                  
                  <button
                    onClick={() => {
                      const newRest = Math.min(rest + 1, restGoal);
                      setRest(newRest);
                      saveDay(water, newRest, exercise);
                    }}
                    className="rounded-full bg-gray-200 px-4 py-2 text-black hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="w-fit shrink-0 rounded-3xl">
          <CardContent className="p-8">
            <p className="text-gray-400">
              this is a test
            </p>
          </CardContent>
        </Card>    

      </div>

      <div className="flex min-w-screen flex-col text-left">
        <p className="text-gray-400">
          Daily History · Last 3 days
        </p>

        <div className="mt-4 flex flex-col gap-4">

          {/* Today */}
          <Card className="rounded-3xl">
            <CardContent className="p-1">
              <h1 className="text-xl font-semibold text-black">
                Today
              </h1>

              <p className="text-gray-400">
                {history[0]?.date}
              </p>

              <div className="mt-4 flex flex-row gap-2">
                <p className="text-black">
                  {checkGoal(history[0]?.data?.water ?? 0, waterGoal)} Water
                </p>

                <p className="text-black">
                  {checkGoal(history[0]?.data?.exercised ?? 0, exerciseGoal)} Exercise
                </p>

                <p className="text-black">
                  {checkGoal(history[0]?.data?.sleep ?? 0, restGoal)} Rest
                </p>
              </div>
            </CardContent>
          </Card>


          {/* Yesterday */}
          <Card className="rounded-3xl">
            <CardContent className="p-1">
              <h1 className="text-xl font-semibold text-black">
                Yesterday
              </h1>

              <p className="text-gray-400">
                {history[1]?.date}
              </p>

              <div className="mt-4 flex flex-row gap-2">
                <p className="text-black">
                  {checkGoal(history[1]?.data?.water ?? 0, waterGoal)} Water
                </p>

                <p className="text-black">
                  {checkGoal(history[1]?.data?.exercised ?? 0, exerciseGoal)} Exercise
                </p>

                <p className="text-black">
                  {checkGoal(history[1]?.data?.sleep ?? 0, restGoal)} Rest
                </p>
              </div>
            </CardContent>
          </Card>


          {/* Previous Day */}
          <Card className="rounded-3xl">
            <CardContent className="p-1">
              <h1 className="text-xl font-semibold text-black">
                Previous Day
              </h1>

              <p className="text-gray-400">
                {history[2]?.date}
              </p>

              <div className="mt-4 flex flex-row gap-2">
                <p className="text-black">
                  {checkGoal(history[2]?.data?.water ?? 0, waterGoal)} Water
                </p>

                <p className="text-black">
                  {checkGoal(history[2]?.data?.exercised ?? 0, exerciseGoal)} Exercise
                </p>

                <p className="text-black">
                  {checkGoal(history[2]?.data?.sleep ?? 0, restGoal)} Rest
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>





      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Daily Login Streak
        </h1>

        <p className="mt-2 text-5xl font-bold">
          {streak}
        </p>

        <p className="text-gray-400">
          days
        </p>

        <button
          onClick={handleLogin}
          className="mt-4 rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
        >
          Daily Login
        </button>
      </div>

      <PhaserGame />
    </main>
  );
}