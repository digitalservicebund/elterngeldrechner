type Zeitraum = { von: Date; bis: Date };
type BetrachtungszeitraumSelbstaendig = Zeitraum;
type BetrachtungszeitraumFragmentNichtSelbstaendig = Zeitraum;

/**
 * The term Betrachtungszeitraum is an internally defined concept
 * used to describe the time span that must be considered when
 * determining the exact Bemessungszeitraum.
 */
export type Betrachtungszeitraum = [
  BetrachtungszeitraumSelbstaendig,
  BetrachtungszeitraumFragmentNichtSelbstaendig,
];
