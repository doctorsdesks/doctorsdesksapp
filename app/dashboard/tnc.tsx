import { ReactNode } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

type SectionProps = {
    id: string, 
    title: string, 
    children: ReactNode 
}

const TnC = () => {
  const company = "Nirvahcare Pvt. Ltd.";
  const app = "Nirvah care";
  const registeredOffice = "Nirvahcare Private limited C/o Krishan Kumar VPO, Chowki No-2 Rewari, Rewari, 123401, Haryana";
  const grievanceEmail = "nirvahcare@gmail.com";
  const grievancePhone = "8057617636";
  const grievanceAddress = "Nirvahcare Private limited C/o Krishan Kumar VPO, Chowki No-2 Rewari, Rewari, 123401, Haryana";
  const dpoEmail = "nirvahcare@gmail.com";
  const jurisdictionCity = "Rewari";
  const arbitrationCity = "Rewari";
  const lastUpdated = "07th September, 2025";

  const Section: React.FC<SectionProps> = ({ id, title, children }) => {
    return (
      <View testID={id} style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionBody}>{children}</View>
      </View>
    );
  };

  const toc = [
    "Definitions",
    "Nature and Applicability of Terms",
    "Conditions of Use and Eligibility",
    "Role of the Company and Scope of Services",
    "User Responsibilities and Code of Conduct",
    "Terms Applicable to Practitioners",
    "Terms Applicable to Patients",
    "Terms for Diagnostic Laboratories",
    "Terms for Enterprise Clients",
    "Reviews and Feedback",
    "Data Collection and Privacy",
    "Intellectual Property Rights",
    "Limitation of Liability",
    "Indemnification",
    "Monetisation, Promotional Offers, and Loyalty Programs",
    "Health Feed and Educational Content",
    "Q&A Forum",
    "Teleconsultation Services",
    "Privacy Policy and Data Handling",
    "Dispute Resolution",
    "Amendments to Terms and Conditions",
    "Contact Information",
  ];

  const handleEmailPress = (email: string) => {
    const url = `mailto:${email}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
    });
  };

  const handlePhonePress = (phone: string) => {
    const url = `tel:${phone}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>TERMS AND CONDITIONS OF USE – {app} APP</Text>
        <Text style={styles.meta}>Last updated: {lastUpdated}</Text>
      </View>

      <View style={styles.noticeBox}>
        <Text style={styles.paragraph}>
          This document is published in compliance with the Information Technology Act, 2000, including Rule 3(1) of the
          Information Technology (Intermediaries Guidelines and Digital Media Ethics Code) Rules, 2021. It constitutes a legally
          binding agreement between {company} and the User and does not require physical or digital signatures.
        </Text>
        <Text style={[styles.paragraph, styles.mt3]}>
          These Terms and Conditions ("Terms") govern the use of the {app} mobile application, website, and all related services
          (collectively referred to as the "Platform"), developed and operated by {company}, a company incorporated under the Companies
          Act, 2013, having its registered office at {registeredOffice} ("Company", "we", "us" or "our"). By accessing, registering, or using the Platform,
          you confirm that you have read, understood, and agree to be bound by these Terms, the Privacy Policy, and all applicable laws of India.
        </Text>
      </View>

      {/* Table of Contents */}
      <View accessibilityLabel="Table of contents" style={styles.tocContainer}>
        <Text style={styles.h2}>Table of Contents</Text>
        {toc.map((title, idx) => (
          <TouchableOpacity key={idx} style={styles.tocItem} accessibilityRole="button">
            <Text style={styles.tocText}>{idx + 1}. {title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 1. Definitions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Definitions</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>1.1 {app}:</Text> The mobile and web-based digital health platform developed and operated by {company} to enable Users to
          connect with healthcare providers, schedule consultations, access diagnostics, and manage personal health records.
        </Text>

        <Text style={[styles.paragraph, styles.mt2]}>
          <Text style={styles.bold}>1.2 User:</Text> Any individual or legal entity who accesses, registers on, or interacts with the Platform, including but not limited
          to Practitioners, Patients, Diagnostic Labs, and Enterprise Clients.
        </Text>

        <Text style={[styles.paragraph, styles.mt2]}>
          <Text style={styles.bold}>1.3 Practitioner:</Text> A licensed and qualified medical professional, including but not limited to doctors, nurses, therapists, and
          specialists, who is registered on the Platform to provide teleconsultation or other medical services.
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bold}>1.3.1</Text> Practitioners must hold active registration under the relevant Medical Council and abide by the Telemedicine Practice Guidelines, 2020.</Text>
          <Text style={styles.listItem}><Text style={styles.bold}>1.3.2</Text> Practitioners are solely responsible for the accuracy of their profile information, adherence to ethical standards, maintenance of medical records, and compliance with all applicable medical laws.</Text>
        </View>

        <Text style={[styles.paragraph, styles.mt2]}>
          <Text style={styles.bold}>1.4 Patient or End-User:</Text> An individual seeking healthcare services on the Platform, whether for self or on behalf of someone else,
          including minors or dependents.
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bold}>1.4.1</Text> Authorized representatives must act in good faith and bear full responsibility for the accuracy of information provided.</Text>
          <Text style={styles.listItem}><Text style={styles.bold}>1.4.2</Text> Patients agree to use the Platform solely for lawful and bona fide health purposes, and not for solicitation, defamation, or misuse.</Text>
        </View>

        <Text style={[styles.paragraph, styles.mt2]}>
          <Text style={styles.bold}>1.5 Diagnostic Lab:</Text> Entities engaged in testing and pathology services registered with the Platform to provide lab services either independently or in partnership.
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bold}>1.5.1</Text> Labs must be accredited by the National Accreditation Board for Testing and Calibration Laboratories (NABL) or equivalent regulatory body and comply with applicable standards of hygiene, confidentiality, and reporting.</Text>
        </View>

        <Text style={[styles.paragraph, styles.mt2]}>
          <Text style={styles.bold}>1.6 Enterprise Client:</Text> A legal entity that engages {app} to provide wellness services, vaccination drives, or health check-up support to its employees or members.
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bold}>1.6.1</Text> Enterprise Clients must ensure that all employee or member data shared with {app} has been lawfully collected with informed consent.</Text>
        </View>

        <Text style={[styles.paragraph, styles.mt2]}>
          <Text style={styles.bold}>1.7 Services:</Text> The collective functionalities of the Platform including, but not limited to, booking of appointments, diagnostics, teleconsultations, access to health records, digital prescriptions, reminders, notifications, and wellness programs.
        </Text>

        <Text style={[styles.paragraph, styles.mt2]}>
          <Text style={styles.bold}>1.8 Personal Data:</Text> Any data or information capable of identifying an individual, including name, contact details, age, gender, location, health history, and government-issued identifiers.
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bold}>1.8.1</Text> This also includes any Sensitive Personal Data or Information (SPDI) as defined under the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</Text>
        </View>

        <Text style={[styles.paragraph, styles.mt2]}>
          <Text style={styles.bold}>1.9 Teleconsultation:</Text> Remote medical consultations delivered by a Practitioner through the Platform using audio, video, or messaging interfaces.
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bold}>1.9.1</Text> Teleconsultation may include pre-consultation intake, in-consultation advice, e-prescriptions, and post-consultation notes, subject to legal limits.</Text>
        </View>

        <Text style={[styles.paragraph, styles.mt2]}>
          <Text style={styles.bold}>1.10 Health Feed:</Text> Educational and informational content such as articles, videos, or blogs available on the Platform that aim to improve health literacy among Users.
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bold}>1.10.1</Text> Health Feed is for general awareness and should not be treated as medical advice, prescription, or diagnosis.</Text>
        </View>
      </View>

      {/* 2. Nature and Applicability of Terms */}
      <Section id="sec-2" title="2. Nature and Applicability of Terms">
        <Text style={styles.paragraph}>
          These Terms apply uniformly to all Users of the Platform regardless of category. By registering or using the Platform, Users
          agree to comply with all terms contained herein, and in other associated policies made available by the Company. These Terms are
          intended to ensure compliance with all applicable laws, including but not limited to, the Indian Contract Act, 1872, the Information
          Technology Act, 2000, and consumer protection laws. These Terms may be supplemented or modified by specific service agreements,
          disclaimers, or policies relevant to a particular service or user group. Continued access or use of the Platform constitutes
          unconditional acceptance of the Terms, including any amendments made from time to time.
        </Text>
      </Section>

      {/* 3. Conditions of Use and Eligibility */}
      <Section id="sec-3" title="3. Conditions of Use and Eligibility">
        <View style={styles.list}>
          <Text style={styles.listItem}>The Platform is available only to individuals who are competent to enter into a legally binding contract under the Indian Contract Act, 1872.</Text>
          <Text style={styles.listItem}>Users must be at least 18 years of age. For minors, parents or legal guardians must supervise and take responsibility for any action performed on the Platform.</Text>
          <Text style={styles.listItem}>By registering on the Platform, Users confirm that all information provided at the time of registration and use is true, complete, and up-to-date.</Text>
          <Text style={styles.listItem}>Users agree not to register multiple accounts under false identities or for any unlawful purposes.</Text>
          <Text style={styles.listItem}>The Company reserves the right to verify the credentials of any User and suspend or terminate access without notice for non-compliance with eligibility criteria.</Text>
          <Text style={styles.listItem}>Users found in violation of the eligibility criteria may be blacklisted from future use of the Platform.</Text>
        </View>
      </Section>

      {/* 4. Role of the Company and Scope of Services */}
      <Section id="sec-4" title="4. Role of the Company and Scope of Services">
        <Text style={styles.paragraph}>
          The Company acts only as an intermediary and facilitator of healthcare services and does not itself provide medical care, diagnosis, prescriptions, or laboratory services. The Platform enables Users to:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>Discover and interact with licensed Practitioners;</Text>
          <Text style={styles.listItem}>Schedule and manage online and in-person consultations;</Text>
          <Text style={styles.listItem}>Access electronic medical records, prescriptions, and diagnostic test reports;</Text>
          <Text style={styles.listItem}>Participate in corporate wellness initiatives and vaccination programs.</Text>
        </View>
        <Text style={[styles.paragraph, styles.mt2]}>
          The Platform is not a replacement for emergency medical care or hospitalization. Any service availed through the Platform is rendered solely by independent third-party healthcare providers. The Company shall not be liable for:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>The qualifications, quality, accuracy, or outcome of medical advice or diagnosis provided by a Practitioner;</Text>
          <Text style={styles.listItem}>Delays, interruptions, or inaccuracies in lab services;</Text>
          <Text style={styles.listItem}>Any medical negligence, misconduct, or fraud committed by third parties.</Text>
        </View>
      </Section>

      {/* 5. User Responsibilities and Code of Conduct */}
      <Section id="sec-5" title="5. User Responsibilities and Code of Conduct">
        <View style={styles.list}>
          <Text style={styles.listItem}>All Users agree to use the Platform only for legitimate healthcare-related purposes.</Text>
          <Text style={styles.listItem}>Users shall not use the Platform for commercial, promotional, or unlawful activities; post defamatory, obscene, or misleading content; upload viruses or malware; disrupt Platform operations; or harvest/scrape data.</Text>
          <Text style={styles.listItem}>Users shall maintain the confidentiality of their login credentials and shall not share their account with third parties.</Text>
          <Text style={styles.listItem}>The Company reserves the right to suspend or terminate any account that violates these terms or applicable law, without prior notice.</Text>
          <Text style={styles.listItem}>Any suspected fraudulent or abusive activity may be referred to law enforcement authorities for investigation.</Text>
        </View>
      </Section>

      {/* 6. Terms Applicable to Practitioners */}
      <Section id="sec-6" title="6. Terms Applicable to Practitioners">
        <View style={styles.list}>
          <Text style={styles.listItem}>Possess and maintain valid professional licenses as per applicable Indian laws; upload accurate and verifiable profile details, including qualifications, specializations, and registration numbers; and comply with applicable medical ethics and Telemedicine Practice Guidelines, 2020.</Text>
          <Text style={styles.listItem}>Practitioners shall not prescribe medication without adequate history or evaluation; solicit patients or engage in competitive practices that violate medical ethics; or provide emergency consultation services through {app}.</Text>
          <Text style={styles.listItem}>The Company may verify credentials, moderate patient reviews, flag potential misconduct, and suspend or remove profiles in case of legal violations, malpractice, or complaints.</Text>
          <Text style={styles.listItem}>By registering, Practitioners authorize the Platform to display their name, photo, qualifications, consultation details, and ratings for promotional and informative purposes.</Text>
        </View>
      </Section>

      {/* 7. Terms Applicable to Patients */}
      <Section id="sec-7" title="7. Terms Applicable to Patients">
        <View style={styles.list}>
          <Text style={styles.listItem}>Provide true, complete, and up-to-date personal and medical information (symptoms, history, allergies, medications, demographics, and relevant documents).</Text>
          <Text style={styles.listItem}>Acknowledge that online consultations are not a replacement for in-person evaluations; diagnoses or advice are based entirely on information shared by the Patient; and outcomes are the sole responsibility of the Practitioner.</Text>
          <Text style={styles.listItem}>Patients shall not book false appointments; record or broadcast Teleconsultations without consent; or leave abusive or defamatory feedback.</Text>
          <Text style={styles.listItem}>Informed consent is deemed to be provided for each consultation, diagnostic, or record shared via the Platform, and Patients agree to consultation etiquette.</Text>
        </View>
      </Section>

      {/* 8. Terms for Diagnostic Laboratories */}
      <Section id="sec-8" title="8. Terms for Diagnostic Laboratories">
        <View style={styles.list}>
          <Text style={styles.listItem}>Labs shall possess necessary licenses and accreditations (such as NABL), employ qualified personnel, and ensure proper handling, preservation, and timely delivery of samples and reports.</Text>
          <Text style={styles.listItem}>Maintain strict confidentiality of patient data; share reports only through the Platform or to authorised individuals; and upload results within stipulated turnaround times.</Text>
          <Text style={styles.listItem}>The Company is not responsible for inaccuracies in test results, failure to deliver timely/valid reports, or recommendations outside medical advice norms.</Text>
          <Text style={styles.listItem}>Unethical or unlawful practices may result in permanent removal from the Platform.</Text>
        </View>
      </Section>

      {/* 9. Terms for Enterprise Clients */}
      <Section id="sec-9" title="9. Terms for Enterprise Clients">
        <View style={styles.list}>
          <Text style={styles.listItem}>Share only verified and authorised employee/beneficiary data; obtain necessary consent; and use services solely for internal wellness, screening, vaccination, or CSR activities.</Text>
          <Text style={styles.listItem}>Clients shall not resell or sublicense access, misuse employee data for monitoring/discrimination, or represent {app} as an insurance provider unless agreed.</Text>
          <Text style={styles.listItem}>The Company is not liable for internal employer-employee disputes, allegations related to wellness engagements, or misuse of the Platform beyond contract scope.</Text>
        </View>
      </Section>

      {/* 10. Reviews and Feedback */}
      <Section id="sec-10" title="10. Reviews and Feedback">
        <View style={styles.list}>
          <Text style={styles.listItem}>Users may post reviews, comments, ratings, or feedback based on genuine personal experience that is respectful and free from vulgar, defamatory, or discriminatory language and personal data.</Text>
          <Text style={styles.listItem}>The Company may monitor, moderate, edit, or remove content that violates these Terms or law, and suspend/ban misuse.</Text>
          <Text style={styles.listItem}>Reviews and ratings once submitted cannot be modified except where factual errors are proven.</Text>
          <Text style={styles.listItem}>Users grant the Company a non-exclusive, royalty-free, perpetual license to display submitted content on the Platform and to use it for marketing or quality improvement purposes.</Text>
        </View>
      </Section>

      {/* 11. Data Collection and Privacy */}
      <Section id="sec-11" title="11. Data Collection and Privacy">
        <View style={styles.list}>
          <Text style={styles.listItem}>The Company complies with applicable data protection laws, including the Digital Personal Data Protection Act, 2023 and the IT SPDI Rules, 2011.</Text>
          <Text style={styles.listItem}>Data collected may include personal identification information, health information, and usage information; collected via user input, tracking technologies, and third-party integrations.</Text>
          <Text style={styles.listItem}>Purposes include delivering/improving services, safety and compliance, and personalisation.</Text>
          <Text style={styles.listItem}>Data is shared only with consent, when required by law, or with providers directly involved in the User’s consultation.</Text>
          <Text style={styles.listItem}>Users may access, rectify, update, or delete their personal data; withdraw consent (subject to legal retention); and raise complaints via the DPO at {dpoEmail}.</Text>
          <Text style={styles.listItem}>Security includes encryption, role-based access controls, and backups; however, the Company is not liable for data loss due to factors beyond its control.</Text>
        </View>
      </Section>

      {/* 12. Intellectual Property Rights */}
      <Section id="sec-12" title="12. Intellectual Property Rights">
        <View style={styles.list}>
          <Text style={styles.listItem}>All IP on the Platform is the property of {company} or its licensors and is protected under applicable laws and treaties.</Text>
          <Text style={styles.listItem}>Includes source/object code, algorithms, UI/UX, logos, names, content, and visual elements.</Text>
          <Text style={styles.listItem}>Users are prohibited from reproducing, copying, modifying, reverse engineering, framing/mirroring, or deceptive linking without permission.</Text>
          <Text style={styles.listItem}>The Company grants Users a limited, non-transferable, revocable license to use the Platform for personal, non-commercial purposes.</Text>
          <Text style={styles.listItem}>Unauthorised use may result in legal action.</Text>
        </View>
      </Section>

      {/* 13. Limitation of Liability */}
      <Section id="sec-13" title="13. Limitation of Liability">
        <View style={styles.list}>
          <Text style={styles.listItem}>To the fullest extent permitted by law, the Company and its affiliates are not liable for losses arising from reliance on Platform content or Practitioner advice; inaccuracy, delay, or failure of lab results or data transmission; non-negligent data breaches; or system interruptions.</Text>
          <Text style={styles.listItem}>The Company’s maximum liability under any claim shall not exceed the amount paid by the User to the Platform in the past 30 days.</Text>
          <Text style={styles.listItem}>Users understand the limitations of telemedicine and assume responsibility for decisions based on digital consultations.</Text>
          <Text style={styles.listItem}>No communication creates a warranty not expressly stated in these Terms.</Text>
        </View>
      </Section>

      {/* 14. Indemnification */}
      <Section id="sec-14" title="14. Indemnification">
        <View style={styles.list}>
          <Text style={styles.listItem}>Users agree to indemnify and hold harmless {company} and its affiliates from liabilities, damages, losses, and costs (including legal fees) arising from breaches of these Terms or the Privacy Policy; misuse or unauthorised use of the Platform; violation of third-party rights; or unlawful/professionally improper use of services.</Text>
          <Text style={styles.listItem}>This obligation survives termination or suspension of the account/use.</Text>
          <Text style={styles.listItem}>The Company may assume exclusive defence and control of any matter otherwise subject to indemnification, and Users shall cooperate fully.</Text>
        </View>
      </Section>

      {/* 15. Monetisation, Promotional Offers, and Loyalty Programs */}
      <Section id="sec-15" title="15. Monetisation, Promotional Offers, and Loyalty Programs">
        <View style={styles.list}>
          <Text style={styles.listItem}>The Company may offer incentives or loyalty programs (e.g., SPICE Points) for bookings, referrals, or participation in wellness drives.</Text>
          <Text style={styles.listItem}>Incentives may expire, are non-transferable and non-cashable, and may be revoked in cases of suspected fraud/abuse.</Text>
          <Text style={styles.listItem}>Promotional offers may include discounts, bundles, or trials; apply only to designated services; and may be discontinued or modified at the Company’s discretion.</Text>
          <Text style={styles.listItem}>Misuse of referral codes/offers can lead to disqualification, suspension, or legal action. Taxes, if any, are borne by the User.</Text>
        </View>
      </Section>

      {/* 16. Health Feed and Educational Content */}
      <Section id="sec-16" title="16. Health Feed and Educational Content">
        <View style={styles.list}>
          <Text style={styles.listItem}>Health Feed content is informational/educational only and is not medical advice or a substitute for professional consultation.</Text>
          <Text style={styles.listItem}>The Company does not guarantee accuracy/completeness/currency, endorse third-party claims, or assume responsibility for reliance.</Text>
          <Text style={styles.listItem}>Users should consult qualified professionals before acting on Health Feed information.</Text>
        </View>
      </Section>

      {/* 17. Q&A Forum */}
      <Section id="sec-17" title="17. Q&A Forum">
        <View style={styles.list}>
          <Text style={styles.listItem}>Q&A content may be publicly visible and searchable; questions should be general and avoid personal identifiers.</Text>
          <Text style={styles.listItem}>Responses are educational and do not create a doctor-patient relationship.</Text>
          <Text style={styles.listItem}>The Company may moderate and remove inappropriate/misleading/promotional content and restrict abusive users.</Text>
          <Text style={styles.listItem}>The Company is not liable for reliance on Q&A responses.</Text>
        </View>
      </Section>

      {/* 18. Teleconsultation Services */}
      <Section id="sec-18" title="18. Teleconsultation Services">
        <View style={styles.list}>
          <Text style={styles.listItem}>Audio, video, and text consultations are suitable only for non-emergency, preliminary, or follow-up care; physical examination may still be required.</Text>
          <Text style={styles.listItem}>Practitioners may decline to diagnose, request in-person follow-up/diagnostics, or issue prescriptions per law and guidelines.</Text>
          <Text style={styles.listItem}>Users shall not record consultations without consent, misrepresent symptoms/history, or use abusive language.</Text>
          <Text style={styles.listItem}>Teleconsultations are not recorded by the Company unless both parties consent or required by law.</Text>
        </View>
      </Section>

      {/* 19. Privacy Policy and Data Handling */}
      <Section id="sec-19" title="19. Privacy Policy and Data Handling">
        <Text style={styles.paragraph}>
          The Company’s comprehensive Privacy Policy forms an integral part of these Terms and is developed in accordance with the Digital Personal Data Protection Act, 2023, the IT SPDI Rules, 2011, and other applicable laws. By using the Platform, Users expressly consent to collection and processing of Personal Data/SPDI for service fulfilment, legal compliance, and legitimate interests; to necessary transfers/disclosures; and to retention for required durations, including after account deactivation. The Privacy Policy details categories of data, lawful bases, and User rights (access, correction/deletion, restriction/objection, consent withdrawal and consequences). In case of inconsistency, the clause that affords greater protection and transparency to the User shall prevail. Privacy grievances and DSARs may be sent to the DPO at {dpoEmail}. The Company does not sell or monetise User data for marketing without express opt-in consent. Anonymised/aggregated data may be used for research, development, product improvement, or analytics.
        </Text>
      </Section>

      {/* 20. Dispute Resolution */}
      <Section id="sec-20" title="20. Dispute Resolution">
        <View style={styles.list}>
          <Text style={styles.listItem}>These Terms are governed by the laws of India. Disputes shall first be resolved amicably through good faith negotiations.</Text>
          <Text style={styles.listItem}>If unresolved within 30 days, disputes shall be referred to arbitration per the Arbitration and Conciliation Act, 1996.</Text>
          <Text style={styles.listItem}>Arbitration proceedings shall be conducted in English (or as mutually decided), held in {arbitrationCity}, and administered by arbitrator(s) mutually appointed by both parties.</Text>
          <Text style={styles.listItem}>Subject to arbitration, courts in {jurisdictionCity} shall have exclusive jurisdiction.</Text>
        </View>
      </Section>

      {/* 21. Amendments to Terms and Conditions */}
      <Section id="sec-21" title="21. Amendments to Terms and Conditions">
        <View style={styles.list}>
          <Text style={styles.listItem}>The Company may revise or amend these Terms and/or the Privacy Policy at any time to reflect business, legal, technical, or regulatory changes, and may introduce additional terms or feature-level disclaimers.</Text>
          <Text style={styles.listItem}>Material updates affecting user rights, data usage, or service scope shall be notified via email, prominent in-app notices, or mandatory consent prompts.</Text>
          <Text style={styles.listItem}>Users should review Terms and the Privacy Policy periodically. Continued use after publication/notification constitutes acceptance.</Text>
          <Text style={styles.listItem}>If a User does not agree with revised Terms, they must discontinue services, contact support to close their account/withdraw consent (as applicable), and settle any pending obligations.</Text>
          <Text style={styles.listItem}>The Company is not liable for loss/inconvenience due to a User’s failure to review or act upon amended Terms. In legal disputes, the version active at the time of the event shall prevail unless superseded by regulation.</Text>
        </View>
      </Section>

      {/* 22. Contact Information */}
      <Section id="sec-22" title="22. Contact Information">
        <Text style={styles.paragraph}>For support, inquiries, or grievance redressal, please contact the designated grievance officer:</Text>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => handleEmailPress(grievanceEmail)}>
            <Text><Text style={styles.bold}>Email:</Text> {grievanceEmail}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePhonePress(grievancePhone)}>
            <Text style={styles.mt2}><Text style={styles.bold}>Phone:</Text> {grievancePhone}</Text>
          </TouchableOpacity>
          <Text style={styles.mt2}><Text style={styles.bold}>Address:</Text> {grievanceAddress}</Text>
        </View>
        <Text style={[styles.paragraph, styles.mt3]}>The Company shall respond to grievances within the timeline prescribed under applicable law (typically within 15 days).</Text>
        <Text style={[styles.paragraph, styles.mt2]}>For privacy-related requests, please write to the Data Protection Officer at <Text style={styles.link} onPress={() => handleEmailPress(dpoEmail)}>{dpoEmail}</Text>.</Text>
      </Section>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} {company}. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

export default TnC;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 12,
  },
  h1: {
    fontSize: 20,
    fontWeight: '700',
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: '#6b7280',
  },
  noticeBox: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#111827',
  },
  mt2: { marginTop: 8 },
  mt3: { marginTop: 12 },
  tocContainer: {
    marginBottom: 12,
  },
  h2: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tocItem: {
    paddingVertical: 6,
  },
  tocText: {
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionBody: {
    marginTop: 6,
  },
  list: {
    marginTop: 8,
    paddingLeft: 10,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  bold: {
    fontWeight: '700',
  },
  card: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
  },
  footer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    alignItems: 'flex-start',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  link: { textDecorationLine: 'underline' },
});
