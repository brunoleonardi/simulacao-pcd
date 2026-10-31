import { SiteShell } from "@/components/layout/SiteShell";
import { TremorExperience } from "@/components/tremor/TremorExperience";

export const metadata = {
  title: "Tremor motor | Além das Barreiras",
};

export default function TremorPage() {
  return (
    <SiteShell>
      <TremorExperience />
    </SiteShell>
  );
}
