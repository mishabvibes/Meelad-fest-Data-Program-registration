import FindRegistration from "@/components/FindRegistration";
import { dbConnect } from "@/lib/mongodb";
import Settings from "@/models/Settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "എന്റെ രജിസ്ട്രേഷൻ കണ്ടെത്തുക | മീലാദ് ഫെസ്റ്റ്",
  description:
    "ഹയാത്തുൽ ഇസ്‌ലാം ഹയർ സെക്കണ്ടറി മദ്‌റസ - മീലാദ് ഫെസ്റ്റ് രജിസ്ട്രേഷൻ കണ്ടെത്തുക & എഡിറ്റ് ചെയ്യുക",
};

export default async function FindRegistrationPage() {
  await dbConnect();
  const settings = await Settings.findOne({});
  const maxOffStageSelections = settings?.maxOffStageSelections ?? 2;
  const maxStageSelections = settings?.maxStageSelections ?? 1;

  return (
    <main>
      <FindRegistration
        maxOffStageSelections={maxOffStageSelections}
        maxStageSelections={maxStageSelections}
      />
    </main>
  );
}
