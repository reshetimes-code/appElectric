import { Badge } from "@/components/ui/Badge";
import { AVAILABILITY_LABELS, AVAILABILITY_TONE } from "@/lib/utils";
import type { AvailabilityStatus } from "@/lib/types";

export function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  return <Badge tone={AVAILABILITY_TONE[status]}>{AVAILABILITY_LABELS[status]}</Badge>;
}
