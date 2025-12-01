import { PersonPageFlow } from "@/application/features/abfrage-prototyp/components/PersonPageRouting";

export function personPageFlow(
  isSelbststaendig: boolean,
  isNichtSelbststaendig: boolean,
  hasKeinEinkommen: boolean,
  hasSozialleistungen: boolean,
): PersonPageFlow {
  if (isSelbststaendig) {
    if (isNichtSelbststaendig) {
      return PersonPageFlow.mischeinkuenfte;
    }
    return PersonPageFlow.selbststaendig;
  } else if (isNichtSelbststaendig) {
    if (hasKeinEinkommen && hasSozialleistungen) {
      return PersonPageFlow.nichtSelbststaendigBeides;
    } else if (hasKeinEinkommen) {
      return PersonPageFlow.nichtSelbststaendigKeinEinkommen;
    } else if (hasSozialleistungen) {
      return PersonPageFlow.nichtSelbststaendigErsatzleistungen;
    }
    return PersonPageFlow.nichtSelbststaendig;
  } else if (hasKeinEinkommen && hasSozialleistungen) {
    return PersonPageFlow.sozialleistungenKeinEinkommen;
  } else if (hasKeinEinkommen) {
    return PersonPageFlow.keinEinkommen;
  } else if (hasSozialleistungen) {
    return PersonPageFlow.sozialleistungen;
  }
  return PersonPageFlow.noFlow;
}
