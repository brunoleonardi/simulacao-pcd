import { SiteShell } from "@/components/layout/SiteShell";
import { DaltonismoExperience } from "@/components/daltonismo/DaltonismoExperience";

export const metadata = {
  title: "Daltonismo | Além das Barreiras",
};

export default function DaltonismoPage() {
  return (
    <SiteShell width="full" flush>
      <DaltonismoExperience />
    </SiteShell>
  );
}
