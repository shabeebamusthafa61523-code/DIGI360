import React from 'react';
import { 
  Sparkles, CheckCircle2, Target, Layers, Video, Palette, 
  Megaphone, Share2, IndianRupee, Award, Globe, Plus, Trash2, X, ShieldCheck 
} from 'lucide-react';

const SERVICE_ICONS = {
  strategy: Target,
  posters: Palette,
  video: Video,
  social: Share2,
  meta: Megaphone,
  default: Layers
};

const getServiceIcon = (title = '') => {
  const t = (title || '').toLowerCase();
  if (t.includes('strat') || t.includes('plan')) return SERVICE_ICONS.strategy;
  if (t.includes('poster') || t.includes('creative') || t.includes('design')) return SERVICE_ICONS.posters;
  if (t.includes('video') || t.includes('reel') || t.includes('ai')) return SERVICE_ICONS.video;
  if (t.includes('social') || t.includes('media') || t.includes('handling')) return SERVICE_ICONS.social;
  if (t.includes('meta') || t.includes('ad') || t.includes('campaign')) return SERVICE_ICONS.meta;
  return SERVICE_ICONS.default;
};

/**
 * Executive Single-Page A4 Proposal Document
 * Pristine white background, compact commercial architecture engineered to fit
 * precisely onto 1 single A4 sheet with zero page overflow.
 * Fully supports live inline WYSIWYG editing when isEditable={true}.
 */
const ProposalPreviewDoc = React.forwardRef(({ 
  proposal, 
  client,
  isEditable = false,
  onUpdateField,
  onUpdateObjective,
  onAddObjective,
  onRemoveObjective,
  onUpdateBenefit,
  onAddBenefit,
  onRemoveBenefit,
  onUpdateService,
  onAddService,
  onRemoveService,
  onUpdateTerm,
  onAddTerm,
  onRemoveTerm,
  onAddPlatform,
  onRemovePlatform
}, ref) => {
  const clientName = proposal?.clientName || client?.companyName || client?.clientName || 'Client Partner';
  const clientLogo = proposal?.clientLogo || client?.companyLogo || '';
  const showLogoImage = Boolean(proposal?.useLogoImage && clientLogo);

  const agencyLogo = proposal?.agencyLogo || proposal?.kodbrandLogo || '/logo2.png';
  const showAgencyLogoImage = proposal?.useAgencyLogoImage !== false && proposal?.useKodbrandLogoImage !== false && Boolean(agencyLogo);
  const agencyName = proposal?.preparedBy || 'DIGI 360 SOLUTIONS';

  const proposalNo = proposal?.proposalNumber || 'PROP-2026-001';
  const proposalDate = proposal?.createdAt
    ? new Date(proposal.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const objectives = proposal?.objectives?.length > 0 ? proposal.objectives : [
    { title: 'Brand Positioning', description: 'Build consistent, premium visual identity across all platforms.' },
    { title: 'Product Showcase', description: 'Highlight key offerings with high-converting creative media & video.' },
    { title: 'Customer Awareness', description: 'Expand reach to relevant high-intent audiences on social channels.' },
    { title: 'Customer Trust', description: 'Showcase authentic proof of work, reviews, and authority content.' },
    { title: 'Lead Generation', description: 'Drive qualified inquiries and direct messages via optimized ad funnels.' }
  ];

  const platforms = proposal?.platforms?.length > 0 ? proposal.platforms : [
    'Facebook', 'Instagram', 'WhatsApp Business', 'Google My Business'
  ];

  const benefits = proposal?.benefits?.length > 0 ? proposal.benefits : [
    'Maximized online visibility among your target geographic & demographic market',
    'Higher conversion rates with professional creative assets & copywriting',
    'Consistent omnichannel posting schedule that keeps your brand top-of-mind',
    'Transparent performance tracking and dedicated campaign optimization'
  ];

  const services = proposal?.services?.length > 0 ? proposal.services : [
    { title: 'Digital Marketing Strategy', description: 'Roadmaps, audience segmentation & content calendar planning.' },
    { title: 'Creative Posters', description: 'High-converting graphics, promotional banners & product carousels.' },
    { title: 'AI Video Production', description: 'Short-form video reels, demo teasers & viral story formats.' },
    { title: 'Social Media Handling', description: 'Publishing, caption writing, community management & profile aesthetics.' },
    { title: 'Meta Advertising', description: 'Hyper-targeted paid campaigns on Facebook & Instagram for leads.' }
  ];

  const terms = proposal?.termsAndConditions?.length > 0 ? proposal.termsAndConditions : [
    'All creative design assets remain proprietary until invoice balance is settled.',
    'Ad spend is payable directly to platforms (Meta/Google) separate from agency fee.',
    'Review SLA: Client reviews and approves creative drafts within 24-48 hours.',
    'Either party may terminate or pause the campaign with a 15-day written notice.'
  ];

  // Inline editable styling helper
  const editCls = isEditable 
    ? "outline-none transition-all rounded hover:bg-purple-50/80 hover:ring-1 hover:ring-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:shadow-xs px-0.5 cursor-text" 
    : "";

  return (
    <div
      ref={ref}
      id="proposal-document-export-root"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        width: '794px',
        maxWidth: '794px',
        margin: '0 auto',
        padding: '18px 22px',
        boxSizing: 'border-box',
        position: 'relative',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '10px'
      }}
    >
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body * {
            visibility: hidden !important;
          }
          #proposal-document-export-root, #proposal-document-export-root * {
            visibility: visible !important;
          }
          #proposal-document-export-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 12mm 15mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
      {/* ========================================================= */}
      {/* 1. CO-BRANDED HEADER & METADATA BAR                       */}
      {/* ========================================================= */}
      <div 
        style={{
          border: '1px solid #e2e8f0',
          background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
          borderRadius: '14px',
          padding: '14px 18px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '12px'
          }}
        >
          {/* Left: Agency Logo (DIGI 360 or Custom) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1' }}>
            {showAgencyLogoImage ? (
              agencyLogo === '/logo2.png' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img
                    src="/logo2.png"
                    alt={agencyName}
                    style={{
                      maxHeight: '34px',
                      maxWidth: '34px',
                      objectFit: 'contain'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>DIGI</span>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#2563eb' }}> 360°</span>
                    </div>
                    <div 
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => onUpdateField && onUpdateField('preparedBy', e.currentTarget.innerText.trim())}
                      className={editCls}
                      style={{ fontSize: '7.5px', fontWeight: 800, letterSpacing: '1.2px', color: '#4f46e5', textTransform: 'uppercase' }}
                    >
                      {agencyName}
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={agencyLogo}
                  alt={agencyName}
                  style={{
                    maxHeight: '36px',
                    maxWidth: '140px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
              )
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                    flexShrink: 0
                  }}
                >
                  <Sparkles style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                </div>
                <div>
                  <div 
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateField && onUpdateField('preparedBy', e.currentTarget.innerText.trim())}
                    className={editCls}
                    style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase' }}
                  >
                    {agencyName}
                  </div>
                  <div style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '1px', color: '#6d28d9', textTransform: 'uppercase' }}>
                    Agency Partner
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center Divider: Stylized ✕ */}
          <div 
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#f3e8ff',
              border: '1px solid #d8b4fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7c3aed',
              fontSize: '13px',
              fontWeight: 900,
              flexShrink: 0
            }}
          >
            ✕
          </div>

          {/* Right: Client Logo OR Styled Client Name */}
          <div 
            style={{
              flex: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              textAlign: 'right'
            }}
          >
            {showLogoImage ? (
              <img
                src={clientLogo}
                alt={clientName}
                style={{
                  maxHeight: '36px',
                  maxWidth: '140px',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <div 
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '6px 14px',
                  borderRadius: '10px'
                }}
              >
                <div 
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateField && onUpdateField('clientName', e.currentTarget.innerText.trim())}
                  className={editCls}
                  style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.3px', color: '#0f172a', textTransform: 'uppercase' }}
                >
                  {clientName}
                </div>
                <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '1px', color: '#64748b', textTransform: 'uppercase' }}>
                  Valued Partner
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Title & Metadata Strip in single compact bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateField && onUpdateField('title', e.currentTarget.innerText.trim())}
              className={editCls}
              style={{
                fontSize: '17px',
                fontWeight: 900,
                letterSpacing: '0.5px',
                margin: 0,
                color: '#0f172a',
                textTransform: 'uppercase'
              }}
            >
              {proposal?.title || 'DIGITAL MARKETING PROPOSAL'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '10px' }}>
            <span style={{ color: '#64748b' }}>
              Ref:{' '}
              <strong 
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => onUpdateField && onUpdateField('proposalNumber', e.currentTarget.innerText.trim())}
                className={editCls}
                style={{ color: '#7c3aed', fontFamily: 'monospace' }}
              >
                {proposalNo}
              </strong>
            </span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ color: '#64748b' }}>Date: <strong style={{ color: '#334155' }}>{proposalDate}</strong></span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span 
              style={{
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '9.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                background: proposal?.status === 'Accepted' ? '#dcfce7' : '#f3e8ff',
                color: proposal?.status === 'Accepted' ? '#15803d' : '#6d28d9',
                border: `1px solid ${proposal?.status === 'Accepted' ? '#86efac' : '#d8b4fe'}`
              }}
            >
              {proposal?.status || 'Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CAMPAIGN GOAL & 5 KEY OBJECTIVES                       */}
      {/* ========================================================= */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '3px', height: '14px', background: 'linear-gradient(180deg, #7c3aed 0%, #a855f7 100%)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0, color: '#0f172a' }}>
              Campaign Goal & Core Objectives
            </h2>
          </div>
          {isEditable && onAddObjective && (
            <button
              type="button"
              onClick={onAddObjective}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 text-[10px] font-bold border border-purple-200 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          )}
        </div>

        {/* Goal statement */}
        <div 
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '8px 12px',
            marginBottom: '8px'
          }}
        >
          <p 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateField && onUpdateField('campaignGoal', e.currentTarget.innerText.trim())}
            className={editCls}
            style={{ margin: 0, fontSize: '10px', lineHeight: '1.4', color: '#475569' }}
          >
            {proposal?.campaignGoal || 'Build a commanding digital presence that drives targeted brand awareness, engages qualified prospects, and systematically converts leads into loyal, repeat customers through high-impact creative storytelling and performance marketing.'}
          </p>
        </div>

        {/* 5 Objectives Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(objectives.length, 5)}, 1fr)`,
            gap: '6px'
          }}
        >
          {objectives.slice(0, 5).map((obj, idx) => (
            <div 
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 10px',
                position: 'relative',
                boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
              }}
            >
              {isEditable && onRemoveObjective && (
                <button
                  type="button"
                  onClick={() => onRemoveObjective(idx)}
                  className="absolute top-1 right-1 text-slate-400 hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span 
                  style={{
                    fontSize: '9px',
                    fontWeight: 900,
                    color: '#7c3aed',
                    background: '#f3e8ff',
                    padding: '1px 5px',
                    borderRadius: '4px'
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span 
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateObjective && onUpdateObjective(idx, 'title', e.currentTarget.innerText.trim())}
                  className={editCls}
                  style={{ fontSize: '10px', fontWeight: 800, color: '#0f172a', lineHeight: '1.2' }}
                >
                  {obj.title.replace(/^\d+\.\s*/, '')}
                </span>
              </div>
              <p 
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => onUpdateObjective && onUpdateObjective(idx, 'description', e.currentTarget.innerText.trim())}
                className={editCls}
                style={{ margin: 0, fontSize: '8.5px', lineHeight: '1.35', color: '#64748b' }}
              >
                {obj.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. PLATFORMS & SERVICES (2-Column Combined Architecture) */}
      {/* ========================================================= */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.9fr',
          gap: '10px'
        }}
      >
        {/* Left: Platforms & Client Benefits */}
        <div 
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Globe style={{ width: '13px', height: '13px', color: '#0284c7' }} />
                Platforms Covered
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {platforms.map((plat, idx) => (
                <span 
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '2px 7px',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    color: '#0369a1',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#0284c7' }} />
                  {plat}
                  {isEditable && onRemovePlatform && (
                    <button type="button" onClick={() => onRemovePlatform(plat)} className="text-slate-400 hover:text-red-500 cursor-pointer">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Award style={{ width: '13px', height: '13px', color: '#7c3aed' }} />
              Key Client Benefits
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {benefits.slice(0, 3).map((benefit, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '12px', height: '12px', color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                  <span 
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateBenefit && onUpdateBenefit(idx, e.currentTarget.innerText.trim())}
                    className={editCls}
                    style={{ fontSize: '9px', lineHeight: '1.3', color: '#334155', flex: 1 }}
                  >
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Services Included */}
        <div 
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '10px 12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '3px', height: '14px', background: 'linear-gradient(180deg, #7c3aed 0%, #0284c7 100%)', borderRadius: '2px' }} />
              <h2 style={{ fontSize: '11.5px', fontWeight: 900, letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0, color: '#0f172a' }}>
                Services Included ({services.length})
              </h2>
            </div>
            {isEditable && onAddService && (
              <button
                type="button"
                onClick={onAddService}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 text-[10px] font-bold border border-purple-200 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            )}
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px'
            }}
          >
            {services.map((srv, idx) => {
              const Icon = getServiceIcon(srv.title);
              return (
                <div 
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '6px 8px',
                    position: 'relative'
                  }}
                >
                  {isEditable && onRemoveService && (
                    <button
                      type="button"
                      onClick={() => onRemoveService(idx)}
                      className="absolute top-1 right-1 text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <div 
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '5px',
                        background: '#f3e8ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon style={{ width: '11px', height: '11px', color: '#7c3aed' }} />
                    </div>
                    <div 
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => onUpdateService && onUpdateService(idx, 'title', e.currentTarget.innerText.trim())}
                      className={editCls}
                      style={{ fontSize: '10px', fontWeight: 800, color: '#0f172a', lineHeight: '1.2' }}
                    >
                      {srv.title}
                    </div>
                  </div>
                  <div 
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateService && onUpdateService(idx, 'description', e.currentTarget.innerText.trim())}
                    className={editCls}
                    style={{ fontSize: '8.5px', lineHeight: '1.3', color: '#64748b' }}
                  >
                    {srv.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. DELIVERABLES & COMMERCIAL PRICE CARD                   */}
      {/* ========================================================= */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <div style={{ width: '3px', height: '14px', background: 'linear-gradient(180deg, #0284c7 0%, #16a34a 100%)', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0, color: '#0f172a' }}>
            Creative Plan Deliverables & Commercials
          </h2>
        </div>

        {/* Deliverables String Banner */}
        <div 
          style={{
            background: 'linear-gradient(90deg, #faf5ff 0%, #f0f9ff 100%)',
            border: '1px solid #ddd6fe',
            borderRadius: '10px',
            padding: '8px 14px',
            marginBottom: '8px'
          }}
        >
          <div style={{ fontSize: '8.5px', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
            Monthly Deliverables Package
          </div>
          <div 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateField && onUpdateField('planDeliverables', e.currentTarget.innerText.trim())}
            className={editCls}
            style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', lineHeight: '1.3' }}
          >
            {proposal?.planDeliverables || 'Creative Posters - 12 | AI Videos - 04 | Meta Ad - 30 days | Social Media Handling - 30 days'}
          </div>
        </div>

        {/* Price Card & Commercial Terms Row */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '8px'
          }}
        >
          {/* Price Card */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%)',
              border: '1.5px solid #d8b4fe',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(124, 58, 237, 0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
              <IndianRupee style={{ width: '13px', height: '13px', color: '#7c3aed' }} />
              <span 
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => onUpdateField && onUpdateField('priceTitle', e.currentTarget.innerText.trim())}
                className={editCls}
                style={{ fontSize: '9.5px', fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase', letterSpacing: '0.8px' }}
              >
                {proposal?.priceTitle || 'Price'}
              </span>
            </div>
            <div 
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateField && onUpdateField('totalCost', e.currentTarget.innerText.trim())}
              className={editCls}
              style={{ fontSize: '20px', fontWeight: 900, color: '#581c87', letterSpacing: '-0.3px', lineHeight: '1.1' }}
            >
              {proposal?.totalCost || 'Rs 13,200'}
            </div>
            <div style={{ fontSize: '8.5px', color: '#7e22ce', fontWeight: 700, marginTop: '2px' }}>
              All deliverables inclusive
            </div>
          </div>

          {/* Commercial Terms Breakdown */}
          <div 
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <div style={{ fontSize: '8.5px', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Commercial Terms
            </div>
            <div style={{ fontSize: '9px', color: '#334155', lineHeight: '1.3' }}>
              • <strong>50% Advance</strong> upon agreement signing to commence strategic onboarding.
            </div>
            <div style={{ fontSize: '9px', color: '#334155', lineHeight: '1.3' }}>
              • <strong>Remaining 50%</strong> scheduled upon mid-month deliverables progress review.
            </div>
            <div style={{ fontSize: '9px', color: '#334155', lineHeight: '1.3' }}>
              • <strong>Ad Spend:</strong> Meta Ad spend is paid directly by client ad account (separate from agency fee).
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. TERMS & CONDITIONS, CLOSING & SIGNATURES              */}
      {/* ========================================================= */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '3px', height: '14px', background: '#94a3b8', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0, color: '#475569' }}>
              Standard Terms & Conditions
            </h2>
          </div>
          {isEditable && onAddTerm && (
            <button
              type="button"
              onClick={onAddTerm}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 text-[10px] font-bold border border-purple-200 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          )}
        </div>

        <div 
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '8px 12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '4px 12px'
          }}
        >
          {terms.slice(0, 4).map((term, idx) => (
            <div key={idx} style={{ fontSize: '8.5px', color: '#475569', lineHeight: '1.3', display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
              <span style={{ color: '#7c3aed', fontWeight: 800 }}>{idx + 1}.</span>
              <span 
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => onUpdateTerm && onUpdateTerm(idx, e.currentTarget.innerText.trim())}
                className={editCls}
                style={{ flex: 1 }}
              >
                {term}
              </span>
              {isEditable && onRemoveTerm && (
                <button type="button" onClick={() => onRemoveTerm(idx)} className="text-slate-400 hover:text-red-500 cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Closing Gratitude Banner */}
        <div 
          style={{
            marginTop: '8px',
            textAlign: 'center',
            padding: '8px 12px',
            background: '#faf5ff',
            border: '1px dashed #d8b4fe',
            borderRadius: '8px'
          }}
        >
          <p 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateField && onUpdateField('closingMessage', e.currentTarget.innerText.trim())}
            className={editCls}
            style={{ margin: 0, fontSize: '10px', fontWeight: 700, color: '#581c87', letterSpacing: '0.2px' }}
          >
            "{proposal?.closingMessage || `Thank you for considering ${agencyName} as your digital marketing partner`}"
          </p>
        </div>

        {/* Signatures & Execution Row */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: '10px',
            paddingTop: '8px',
            borderTop: '1px solid #f1f5f9'
          }}
        >
          <div>
            <div style={{ height: '24px', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#2563eb', fontStyle: 'italic', fontFamily: 'serif' }}>
                {agencyName}
              </span>
            </div>
            <div style={{ width: '150px', height: '1px', background: '#cbd5e1', marginTop: '2px' }} />
            <div style={{ fontSize: '8.5px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>Authorized Agency Signatory</div>
            <div style={{ fontSize: '8px', color: '#64748b' }}>{agencyName}</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ height: '24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>
                _____________________
              </span>
            </div>
            <div style={{ width: '150px', height: '1px', background: '#cbd5e1', marginTop: '2px', marginLeft: 'auto' }} />
            <div style={{ fontSize: '8.5px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>Accepted & Approved By</div>
            <div style={{ fontSize: '8px', color: '#0284c7' }}>{clientName}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProposalPreviewDoc.displayName = 'ProposalPreviewDoc';

export default ProposalPreviewDoc;
