import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET(req) {
  try {

    await dbConnect();
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({ maxOffStageSelections: 2, maxStageSelections: 1 });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("Settings GET error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req) {
  try {

    const body = await req.json();
    const maxOffStageSelections = parseInt(body.maxOffStageSelections, 10);
    const maxStageSelections = parseInt(body.maxStageSelections, 10);

    if (
      isNaN(maxOffStageSelections) ||
      maxOffStageSelections < 0 ||
      isNaN(maxStageSelections) ||
      maxStageSelections < 0
    ) {
      return NextResponse.json(
        { error: "Invalid value for maxOffStageSelections or maxStageSelections" },
        { status: 400 }
      );
    }

    await dbConnect();
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({ maxOffStageSelections, maxStageSelections });
    } else {
      settings.maxOffStageSelections = maxOffStageSelections;
      settings.maxStageSelections = maxStageSelections;
      await settings.save();
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("Settings PUT error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
