import React from 'react';

export const ProposalPdfTemplate = React.forwardRef(({ proposal, client }, ref) => {
  if (!proposal) return null;

  const clientName = proposal.clientName || client?.companyName || client?.clientName || 'DRIVE LINE';
  const proposalType = proposal.proposalType || 'DIGITAL MARKETING';
  const proposalTitle = proposal.title || `${proposalType} PROPOSAL`;
  const preparedBy = proposal.preparedBy || 'DIGI 360 SOLUTIONS';
  const totalCost = proposal.totalCost || 'Rs 13,200';

  const objectives = Array.isArray(proposal.objectives) && proposal.objectives.length > 0 
    ? proposal.objectives 
    : [
        { title: '01. BRAND POSITIONING', description: `Position ${clientName} as a reliable and trusted auto spare parts supplier in the region.` },
        { title: '02. PRODUCT SHOWCASE', description: 'Promote available spare parts, automotive components, product categories and special offers through professional posters and engaging videos.' },
        { title: '03. CUSTOMER AWARENESS', description: 'Create informative content highlighting spare parts, product features, compatibility and the importance of choosing suitable components.' },
        { title: '04. CUSTOMER TRUST', description: 'Build credibility through product-focused content, business highlights, customer feedback and consistent digital communication.' },
        { title: '05. LEAD GENERATION', description: 'Generate customer enquiries through Facebook, Instagram and WhatsApp Business, supported by targeted Meta Advertising campaigns.' },
      ];

  const platforms = Array.isArray(proposal.platforms) && proposal.platforms.length > 0
    ? proposal.platforms
    : ['Facebook', 'Instagram', 'WhatsApp Business (Lead Generation)'];

  const benefits = Array.isArray(proposal.benefits) && proposal.benefits.length > 0
    ? proposal.benefits
    : [
        'Stronger automotive brand positioning',
        'Greater visibility in market',
        'Professional digital presence',
        'Better spare parts promotion',
        'Increased customer awareness',
        'Improved brand trust',
        'More customer enquiries',
        'Wider reach among garages and workshops',
        'Better product visibility through digital campaigns'
      ];

  const services = Array.isArray(proposal.services) && proposal.services.length > 0
    ? proposal.services
    : [
        { title: 'DIGITAL MARKETING STRATEGY', description: `A customized strategy based on ${clientName}'s product range, target customers, local market and business objectives.` },
        { title: 'CREATIVE POSTERS', description: 'Professional promotional and informative posters featuring spare parts, product categories, special offers, brand highlights and automotive-related content.' },
        { title: 'AI VIDEO PRODUCTION', description: 'Creation of AI-generated promotional videos to showcase automotive spare parts, highlight products, communicate key selling points and make the brand\'s social media content more engaging.' },
        { title: 'SOCIAL MEDIA MANAGEMENT', description: 'Social media handling, including content planning, caption writing, hashtag research, scheduling, publishing and maintaining a consistent brand presence.' },
        { title: 'META ADVERTISING', description: 'Facebook and Instagram advertising campaigns designed to increase local visibility, promote spare parts and generate enquiries from potential customers.' }
      ];

  const terms = Array.isArray(proposal.termsAndConditions) && proposal.termsAndConditions.length > 0
    ? proposal.termsAndConditions
    : [
        'All creatives will follow the approved brand guidelines.',
        'Product information, availability, pricing and compatibility details must be confirmed by the client before publication.',
        'Minor revisions are included; major revisions or additional deliverables may incur extra charges.',
        'Meta advertising spend is separate from the service fee.',
        'Advanced video production or additional content beyond the agreed scope may incur additional charges.',
        'A 50% advance payment is required before commencement.',
        'Continued marketing and optimization are recommended for sustained brand growth and lead generation.'
      ];

  const planDeliverables = proposal.planDeliverables || 'Creative Posters - 12 | AI Videos - 04\nMeta Ad - 30 days | Social Media Handling - 30 days\nPerformance Analysis - 30 days';

  return (
    <div 
      ref={ref}
      id="proposal-pdf-container" 
      className="bg-[#050508] text-white font-sans"
      style={{ width: '1120px', margin: '0 auto', color: '#ffffff' }}
    >
      {/* PAGE 1: COVER SLIDE */}
      <div 
        className="relative flex flex-col justify-between p-16 overflow-hidden border-b border-slate-900"
        style={{
          width: '1120px',
          minHeight: '630px',
          background: 'radial-gradient(circle at 15% 20%, rgba(139, 92, 246, 0.28) 0%, rgba(5, 5, 8, 1) 60%), radial-gradient(circle at 85% 80%, rgba(99, 102, 241, 0.2) 0%, rgba(5, 5, 8, 1) 65%)',
          pageBreakAfter: 'always'
        }}
      >
        {/* Star Sparkle Icon top left */}
        <div className="absolute top-10 left-10 text-violet-400/80">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        {/* Co-Branded Header: Agency Logo X Client Logo / Name */}
        <div className="flex items-center justify-center gap-12 pt-28 pb-10">
          {/* Agency Logo or Text Name */}
          <div className="flex items-center justify-center min-w-[200px] max-w-[380px]">
            {proposal.useAgencyLogoImage !== false && (proposal.agencyLogo || '/logo2.png') ? (
              proposal.agencyLogo && proposal.agencyLogo !== '/logo2.png' ? (
                <img 
                  src={proposal.agencyLogo} 
                  alt={preparedBy} 
                  className="max-h-20 max-w-[280px] object-contain drop-shadow-[0_4px_16px_rgba(59,130,246,0.3)]"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="flex items-center gap-4">
                  <img 
                    src="/logo2.png" 
                    alt="DIGI 360" 
                    className="h-16 w-16 object-contain drop-shadow-[0_4px_16px_rgba(59,130,246,0.3)]"
                  />
                  <div className="flex flex-col text-left">
                    <div className="flex items-baseline tracking-tight">
                      <span className="text-4xl lg:text-5xl font-black uppercase text-white tracking-wider">DIGI</span>
                      <span className="text-4xl lg:text-5xl font-black text-blue-500 tracking-wider ml-2">360°</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mt-0.5">
                      SOLUTIONS
                    </span>
                  </div>
                </div>
              )
            ) : (
              <h1 className="text-4xl lg:text-5xl font-black uppercase text-white tracking-widest text-center">
                {preparedBy}
              </h1>
            )}
          </div>

          {/* Cross divider */}
          <div className="text-slate-500 text-3xl font-light">✕</div>

          {/* Client Logo or Text Name */}
          <div className="flex items-center justify-center min-w-[200px] max-w-[380px]">
            {proposal.useLogoImage && proposal.clientLogo ? (
              <img 
                src={proposal.clientLogo} 
                alt={clientName} 
                className="max-h-20 max-w-[280px] object-contain drop-shadow-[0_4px_16px_rgba(255,255,255,0.15)]"
                crossOrigin="anonymous"
              />
            ) : (
              <h1 className="text-4xl lg:text-5xl font-black uppercase text-white tracking-widest text-center">
                {clientName}
              </h1>
            )}
          </div>
        </div>

        {/* Center Title & Subtitle */}
        <div className="text-center my-auto pb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-widest text-white mb-4">
            {proposalTitle}
          </h2>
          <p className="text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">
            {preparedBy}
          </p>
        </div>

        {/* Proposal Code & Date bottom */}
        <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest pt-6 border-t border-slate-800/60">
          <span>{proposal.proposalNumber || 'PROP-001'}</span>
          <span>Date: {proposal.issueDate || new Date().toISOString().split('T')[0]}</span>
        </div>
      </div>

      {/* PAGE 2: CAMPAIGN GOAL & OBJECTIVES */}
      <div 
        className="relative flex flex-col justify-between p-14 overflow-hidden border-b border-slate-900"
        style={{
          width: '1120px',
          minHeight: '630px',
          background: 'radial-gradient(circle at 90% 15%, rgba(139, 92, 246, 0.18) 0%, rgba(5, 5, 8, 1) 60%)',
          pageBreakAfter: 'always'
        }}
      >
        <div>
          <div className="text-center mb-6">
            <h2 className="text-4xl font-black uppercase tracking-wider text-white mb-4">
              CAMPAIGN GOAL
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl mx-auto font-normal">
              {proposal.campaignGoal || `To establish ${clientName} as a recognizable and trusted supplier through engaging visual content, product showcases, AI-generated videos and consistent digital communication. The focus will be on increasing brand awareness, showcasing available products, reaching potential customers and generating quality enquiries.`}
            </p>
          </div>

          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 rounded-lg bg-violet-950/60 border border-violet-500/30 text-[11px] font-black uppercase tracking-widest text-violet-300">
              CAMPAIGN OBJECTIVES
            </span>
          </div>

          {/* 5 Objectives Layout */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {objectives.slice(0, 3).map((obj, i) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-slate-900/40 border border-violet-500/30 relative flex flex-col shadow-lg"
              >
                <div className="absolute top-2 left-2 w-2 h-2 rounded-xs bg-violet-400"></div>
                <h4 className="text-xs font-black uppercase text-white mb-2 tracking-wide">
                  {obj.title}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {obj.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom 2 Objectives centered */}
          <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
            {objectives.slice(3, 5).map((obj, i) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-slate-900/40 border border-violet-500/30 relative flex flex-col shadow-lg"
              >
                <div className="absolute top-2 left-2 w-2 h-2 rounded-xs bg-violet-400"></div>
                <h4 className="text-xs font-black uppercase text-white mb-2 tracking-wide">
                  {obj.title}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {obj.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-widest pt-4">
          <span>{proposalTitle}</span>
          <span>Page 2</span>
        </div>
      </div>

      {/* PAGE 3: PLATFORMS COVERED & BENEFITS */}
      <div 
        className="relative flex flex-col justify-between p-14 overflow-hidden border-b border-slate-900"
        style={{
          width: '1120px',
          minHeight: '630px',
          background: 'radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.2) 0%, rgba(5, 5, 8, 1) 60%)',
          pageBreakAfter: 'always'
        }}
      >
        <div className="max-w-4xl mx-auto w-full pt-4">
          {/* Platforms Covered */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black uppercase tracking-wider text-white mb-5">
              PLATFORMS COVERED
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {platforms.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 px-5 py-2 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs font-bold text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8">
            <h3 className="text-3xl font-black uppercase tracking-wider text-white text-center mb-2">
              BENEFITS FOR {clientName.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400 text-center mb-6 font-medium">
              Our digital strategy will help {clientName} achieve:
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-w-3xl mx-auto">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0 mt-1.5"></span>
                  <span className="text-xs text-slate-200 leading-relaxed font-normal">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-widest pt-4">
          <span>{proposalTitle}</span>
          <span>Page 3</span>
        </div>
      </div>

      {/* PAGE 4: SERVICES INCLUDED */}
      <div 
        className="relative flex flex-col justify-between p-14 overflow-hidden border-b border-slate-900"
        style={{
          width: '1120px',
          minHeight: '630px',
          background: 'radial-gradient(circle at 80% 30%, rgba(99, 102, 241, 0.2) 0%, rgba(5, 5, 8, 1) 65%)',
          pageBreakAfter: 'always'
        }}
      >
        <div>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black uppercase tracking-wider text-white">
              SERVICES INCLUDED
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {services.slice(0, 4).map((srv, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-slate-900/40 border border-violet-500/30 flex flex-col shadow-lg"
              >
                <h4 className="text-xs font-black uppercase text-white mb-2 tracking-wide">
                  {srv.title}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {srv.description}
                </p>
              </div>
            ))}
          </div>

          {/* 5th Service Card Centered */}
          {services[4] && (
            <div className="max-w-xl mx-auto">
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-violet-500/30 flex flex-col shadow-lg">
                <h4 className="text-xs font-black uppercase text-white mb-2 tracking-wide">
                  {services[4].title}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {services[4].description}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-widest pt-4">
          <span>{proposalTitle}</span>
          <span>Page 4</span>
        </div>
      </div>

      {/* PAGE 5: CREATIVE PLAN & TERMS & CONDITIONS */}
      <div 
        className="relative flex flex-col justify-between p-14 overflow-hidden border-b border-slate-900"
        style={{
          width: '1120px',
          minHeight: '630px',
          background: 'radial-gradient(circle at 15% 70%, rgba(139, 92, 246, 0.22) 0%, rgba(5, 5, 8, 1) 65%)',
          pageBreakAfter: 'always'
        }}
      >
        <div className="max-w-4xl mx-auto w-full">
          {/* First Month Creative Plan */}
          <div className="text-center mb-8 pb-6 border-b border-slate-800/80">
            <h2 className="text-3xl font-black uppercase tracking-wider text-white mb-3">
              FIRST MONTH CREATIVE PLAN
            </h2>
            <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-semibold max-w-2xl mx-auto">
              {planDeliverables}
            </div>
            <div className="mt-4">
              <span className="inline-block px-5 py-2 rounded-xl bg-violet-600/30 border border-violet-400 text-sm font-black uppercase text-violet-200 tracking-wider">
                Total Cost: {totalCost}
              </span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div>
            <h3 className="text-2xl font-black uppercase tracking-wider text-white text-center mb-4">
              TERMS & CONDITIONS
            </h3>
            <div className="space-y-2 max-w-2xl mx-auto">
              {terms.map((t, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-violet-400 text-xs shrink-0 mt-0.5">•</span>
                  <span className="text-[11px] text-slate-300 leading-relaxed font-normal">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-widest pt-4">
          <span>{proposalTitle}</span>
          <span>Page 5</span>
        </div>
      </div>

      {/* PAGE 6: THANK YOU CLOSING */}
      <div 
        className="relative flex flex-col justify-center items-center p-16 text-center overflow-hidden"
        style={{
          width: '1120px',
          minHeight: '630px',
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, rgba(5, 5, 8, 1) 70%)'
        }}
      >
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Thank You Header in border frame with cursor */}
          <div className="border border-violet-500/40 rounded-2xl p-10 bg-slate-900/30 backdrop-blur-md mb-8 relative inline-block">
            <h1 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white">
              THANK YOU
            </h1>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 text-violet-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 0L18 14L10 16L6 24L2 22L6 14L0 12L4 0Z" />
              </svg>
            </div>
          </div>

          <p className="text-sm font-extrabold uppercase tracking-widest text-slate-300">
            THANK YOU FOR CONSIDERING <span className="bg-blue-600 text-white px-2.5 py-1 rounded font-black">{preparedBy || 'DIGI 360'}</span> AS YOUR DIGITAL MARKETING PARTNER
          </p>

          <div className="mt-12 pt-8 border-t border-slate-800/80 flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest w-full">
            <span>Prepared for: {clientName}</span>
            <span>By: {preparedBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ProposalPdfTemplate.displayName = 'ProposalPdfTemplate';
export default ProposalPdfTemplate;
