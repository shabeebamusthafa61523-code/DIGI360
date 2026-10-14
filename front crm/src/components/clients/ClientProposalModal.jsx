import React, { useState, useEffect } from 'react';
import { 
  X, Upload, Image as ImageIcon, Sparkles, Plus, Trash2, Check, FileText, 
  Settings, Target, Globe, Layers, DollarSign, Shield
} from 'lucide-react';

export default function ClientProposalModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  proposal = null, 
  client = null, 
  loading = false 
}) {
  const [activeSection, setActiveSection] = useState('branding');

  const defaultObjectives = [
    { title: '01. BRAND POSITIONING', description: `Position ${client?.companyName || 'the brand'} as a reliable and trusted automotive spare parts source in the region.` },
    { title: '02. PRODUCT SHOWCASE', description: 'Promote available spare parts, automotive components, product categories and special offers through professional posters and engaging videos.' },
    { title: '03. CUSTOMER AWARENESS', description: 'Create informative content highlighting spare parts, product features, compatibility and the importance of choosing suitable components.' },
    { title: '04. CUSTOMER TRUST', description: 'Build credibility through product-focused content, business highlights, customer feedback and consistent digital communication.' },
    { title: '05. LEAD GENERATION', description: 'Generate customer enquiries through Facebook, Instagram and WhatsApp Business, supported by targeted Meta Advertising campaigns.' },
  ];

  const defaultPlatforms = ['Facebook', 'Instagram', 'WhatsApp Business (Lead Generation)'];

  const defaultBenefits = [
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

  const defaultServices = [
    { title: 'DIGITAL MARKETING STRATEGY', description: `A customized strategy based on ${client?.companyName || 'client'}'s product range, target customers, local market and business objectives.` },
    { title: 'CREATIVE POSTERS', description: 'Professional promotional and informative posters featuring spare parts, product categories, special offers, brand highlights and automotive-related content.' },
    { title: 'AI VIDEO PRODUCTION', description: 'Creation of AI-generated promotional videos to showcase automotive spare parts, highlight products, communicate key selling points and make the brand\'s social media content more engaging.' },
    { title: 'SOCIAL MEDIA MANAGEMENT', description: 'Social media handling, including content planning, caption writing, hashtag research, scheduling, publishing and maintaining a consistent brand presence.' },
    { title: 'META ADVERTISING', description: 'Facebook and Instagram advertising campaigns designed to increase local visibility, promote spare parts and generate enquiries from potential customers.' }
  ];

  const defaultTerms = [
    'All creatives will follow the approved brand guidelines.',
    'Product information, availability, pricing and compatibility details must be confirmed by the client before publication.',
    'Minor revisions are included; major revisions or additional deliverables may incur extra charges.',
    'Meta advertising spend is separate from the service fee.',
    'Advanced video production or additional content beyond the agreed scope may incur additional charges.',
    'A 50% advance payment is required before commencement.',
    'Continued marketing and optimization are recommended for sustained brand growth and lead generation.'
  ];

  const [formData, setFormData] = useState({
    title: 'DIGITAL MARKETING PROPOSAL',
    proposalType: 'DIGITAL MARKETING',
    preparedBy: 'DIGI 360 SOLUTIONS',
    agencyLogo: '/logo2.png',
    useAgencyLogoImage: true,
    clientName: '',
    clientLogo: '',
    useLogoImage: false,
    status: 'Draft',
    totalCost: 'Rs 13,200',
    issueDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    campaignGoal: '',
    objectives: defaultObjectives,
    platforms: defaultPlatforms,
    benefits: defaultBenefits,
    services: defaultServices,
    planDeliverables: 'Creative Posters - 12 | AI Videos - 04\nMeta Ad - 30 days | Social Media Handling - 30 days\nPerformance Analysis - 30 days',
    termsAndConditions: defaultTerms
  });

  useEffect(() => {
    if (proposal) {
      setFormData({
        title: proposal.title || 'DIGITAL MARKETING PROPOSAL',
        proposalType: proposal.proposalType || 'DIGITAL MARKETING',
        preparedBy: proposal.preparedBy || 'DIGI 360 SOLUTIONS',
        agencyLogo: proposal.agencyLogo || '/logo2.png',
        useAgencyLogoImage: proposal.useAgencyLogoImage ?? true,
        clientName: proposal.clientName || client?.companyName || client?.clientName || '',
        clientLogo: proposal.clientLogo || client?.companyLogo || '',
        useLogoImage: proposal.useLogoImage ?? !!(proposal.clientLogo || client?.companyLogo),
        status: proposal.status || 'Draft',
        totalCost: proposal.totalCost || 'Rs 13,200',
        issueDate: proposal.issueDate || new Date().toISOString().split('T')[0],
        validUntil: proposal.validUntil || '',
        campaignGoal: proposal.campaignGoal || '',
        objectives: Array.isArray(proposal.objectives) && proposal.objectives.length > 0 ? proposal.objectives : defaultObjectives,
        platforms: Array.isArray(proposal.platforms) && proposal.platforms.length > 0 ? proposal.platforms : defaultPlatforms,
        benefits: Array.isArray(proposal.benefits) && proposal.benefits.length > 0 ? proposal.benefits : defaultBenefits,
        services: Array.isArray(proposal.services) && proposal.services.length > 0 ? proposal.services : defaultServices,
        planDeliverables: proposal.planDeliverables || 'Creative Posters - 12 | AI Videos - 04\nMeta Ad - 30 days | Social Media Handling - 30 days\nPerformance Analysis - 30 days',
        termsAndConditions: Array.isArray(proposal.termsAndConditions) && proposal.termsAndConditions.length > 0 ? proposal.termsAndConditions : defaultTerms
      });
    } else if (client) {
      const cName = client.companyName || client.clientName || 'DRIVE LINE';
      setFormData({
        title: 'DIGITAL MARKETING PROPOSAL',
        proposalType: 'DIGITAL MARKETING',
        preparedBy: 'DIGI 360 SOLUTIONS',
        agencyLogo: '/logo2.png',
        useAgencyLogoImage: true,
        clientName: cName,
        clientLogo: client.companyLogo || '',
        useLogoImage: !!client.companyLogo,
        status: 'Draft',
        totalCost: 'Rs 13,200',
        issueDate: new Date().toISOString().split('T')[0],
        validUntil: '',
        campaignGoal: `To establish ${cName} as a recognizable and trusted auto spare parts supplier through engaging visual content, product showcases, AI-generated videos and consistent digital communication. The focus will be on increasing brand awareness, showcasing available spare parts, reaching potential customers and generating quality enquiries.`,
        objectives: defaultObjectives,
        platforms: defaultPlatforms,
        benefits: defaultBenefits,
        services: defaultServices,
        planDeliverables: 'Creative Posters - 12 | AI Videos - 04\nMeta Ad - 30 days | Social Media Handling - 30 days\nPerformance Analysis - 30 days',
        termsAndConditions: defaultTerms
      });
    }
  }, [proposal, client, isOpen]);

  if (!isOpen) return null;

  // Handle agency logo upload
  const handleAgencyLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        agencyLogo: reader.result,
        useAgencyLogoImage: true
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleResetAgencyLogo = () => {
    setFormData(prev => ({
      ...prev,
      agencyLogo: '/logo2.png',
      useAgencyLogoImage: true,
      preparedBy: 'DIGI 360 SOLUTIONS'
    }));
  };

  // Handle client logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        clientLogo: reader.result,
        useLogoImage: true
      }));
    };
    reader.readAsDataURL(file);
  };

  // Section item handlers
  const handleObjectiveChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.objectives];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, objectives: updated };
    });
  };

  const handleAddObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, { title: `0${prev.objectives.length + 1}. NEW OBJECTIVE`, description: 'Objective description here.' }]
    }));
  };

  const handleRemoveObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const handleServiceChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.services];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, services: updated };
    });
  };

  const handleAddService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { title: 'NEW SERVICE TITLE', description: 'Service description and deliverables.' }]
    }));
  };

  const handleRemoveService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleAddPlatform = () => {
    setFormData(prev => ({ ...prev, platforms: [...prev.platforms, 'New Platform'] }));
  };

  const handlePlatformChange = (index, val) => {
    setFormData(prev => {
      const updated = [...prev.platforms];
      updated[index] = val;
      return { ...prev, platforms: updated };
    });
  };

  const handleRemovePlatform = (index) => {
    setFormData(prev => ({ ...prev, platforms: prev.platforms.filter((_, i) => i !== index) }));
  };

  const handleAddBenefit = () => {
    setFormData(prev => ({ ...prev, benefits: [...prev.benefits, 'New benefit for client'] }));
  };

  const handleBenefitChange = (index, val) => {
    setFormData(prev => {
      const updated = [...prev.benefits];
      updated[index] = val;
      return { ...prev, benefits: updated };
    });
  };

  const handleRemoveBenefit = (index) => {
    setFormData(prev => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));
  };

  const handleAddTerm = () => {
    setFormData(prev => ({ ...prev, termsAndConditions: [...prev.termsAndConditions, 'New commercial or project condition.'] }));
  };

  const handleTermChange = (index, val) => {
    setFormData(prev => {
      const updated = [...prev.termsAndConditions];
      updated[index] = val;
      return { ...prev, termsAndConditions: updated };
    });
  };

  const handleRemoveTerm = (index) => {
    setFormData(prev => ({ ...prev, termsAndConditions: prev.termsAndConditions.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-600/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {proposal ? 'Edit Client Proposal' : 'Create Client Proposal'}
              </h2>
              <p className="text-xs text-slate-500">
                Customized for {client?.companyName || 'Client'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto shrink-0">
          {[
            { id: 'branding', label: '1. Logo & Proposal Type', icon: ImageIcon },
            { id: 'goals', label: '2. Goals & Objectives', icon: Target },
            { id: 'platforms', label: '3. Platforms & Benefits', icon: Globe },
            { id: 'services', label: '4. Services Included', icon: Layers },
            { id: 'commercials', label: '5. Pricing & Terms', icon: DollarSign }
          ].map(sec => {
            const Icon = sec.icon;
            const active = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                  active 
                    ? 'border-violet-600 text-violet-600 dark:text-violet-400 bg-white dark:bg-slate-900' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={14} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. BRANDING & LOGOS SECTION */}
          {activeSection === 'branding' && (
            <div className="space-y-6">
              {/* Co-Branded Live Preview Box */}
              <div className="p-6 rounded-2xl bg-[#070709] border border-violet-500/30 text-white flex flex-col items-center justify-center gap-4 relative overflow-hidden shadow-inner">
                <div className="absolute top-2 left-2 text-[10px] font-bold text-violet-400/80 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={12} /> Header Branding Preview
                </div>
                
                <div className="flex items-center gap-8 pt-4 pb-2">
                  {/* Agency / Company side */}
                  <div className="flex items-center justify-center min-w-[120px]">
                    {formData.useAgencyLogoImage && formData.agencyLogo ? (
                      formData.agencyLogo === '/logo2.png' ? (
                        <div className="flex items-center gap-2.5">
                          <img src="/logo2.png" alt="DIGI 360" className="h-9 w-9 object-contain" />
                          <div className="flex items-baseline tracking-tight">
                            <span className="text-2xl font-black uppercase text-white tracking-wider">DIGI</span>
                            <span className="text-2xl font-black text-blue-500 tracking-wider ml-1">360°</span>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={formData.agencyLogo} 
                          alt="Agency Logo" 
                          className="max-h-12 max-w-[160px] object-contain"
                        />
                      )
                    ) : (
                      <span className="text-2xl font-black uppercase tracking-wider text-white">
                        {formData.preparedBy || 'DIGI 360'}
                      </span>
                    )}
                  </div>

                  <span className="text-slate-500 text-2xl font-light">✕</span>

                  {/* Client side */}
                  <div className="flex items-center justify-center min-w-[120px]">
                    {formData.useLogoImage && formData.clientLogo ? (
                      <img 
                        src={formData.clientLogo} 
                        alt="Client Logo" 
                        className="max-h-12 max-w-[160px] object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-black uppercase tracking-wider text-white">
                        {formData.clientName || 'CLIENT NAME'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-black uppercase tracking-wider text-white">
                    {formData.title || `${formData.proposalType} PROPOSAL`}
                  </h3>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mt-0.5">
                    {formData.preparedBy || 'PREPARED BY: DIGI 360 SOLUTIONS'}
                  </p>
                </div>
              </div>

              {/* Logo Controls Grid: Agency Branding & Client Branding */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Agency / Provider Branding */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Agency / Provider Branding
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-slate-500">Use Logo Image</label>
                      <input
                        type="checkbox"
                        checked={formData.useAgencyLogoImage}
                        onChange={e => setFormData({ ...formData, useAgencyLogoImage: e.target.checked })}
                        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Agency / Provider Name
                    </label>
                    <input
                      type="text"
                      value={formData.preparedBy}
                      onChange={e => setFormData({ ...formData, preparedBy: e.target.value })}
                      placeholder="e.g. DIGI 360 SOLUTIONS"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  {formData.useAgencyLogoImage && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-400">
                        Upload Agency Logo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAgencyLogoUpload}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-violet-50 file:text-violet-600 hover:file:bg-violet-100 dark:file:bg-slate-800 dark:file:text-violet-400 cursor-pointer"
                      />
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {formData.agencyLogo === '/logo2.png' ? 'Default DIGI 360 logo active' : 'Custom logo loaded'}
                        </span>
                        {formData.agencyLogo !== '/logo2.png' && (
                          <button
                            type="button"
                            onClick={handleResetAgencyLogo}
                            className="text-[10px] font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 underline cursor-pointer"
                          >
                            Reset to Default DIGI 360
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Client Logo Upload / Name */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Client Branding
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-slate-500">Use Logo Image</label>
                      <input
                        type="checkbox"
                        checked={formData.useLogoImage}
                        onChange={e => setFormData({ ...formData, useLogoImage: e.target.checked })}
                        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Client / Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="e.g. DRIVE LINE"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  {formData.useLogoImage && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-400">
                        Upload Client Logo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-violet-50 file:text-violet-600 hover:file:bg-violet-100 dark:file:bg-slate-800 dark:file:text-violet-400 cursor-pointer"
                      />
                      <div className="flex items-center justify-between pt-1">
                        {formData.clientLogo ? (
                          <>
                            <span className="text-[10px] text-emerald-600 font-bold">
                              ✓ Client logo loaded
                            </span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, clientLogo: '', useLogoImage: false }))}
                              className="text-[10px] font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer"
                            >
                              Remove Logo
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400">No client logo selected</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Proposal Type & Title Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Proposal Type (e.g. DIGITAL MARKETING, WEB DEVELOPMENT)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.proposalType}
                    onChange={e => {
                      const newType = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        proposalType: newType,
                        title: `${newType} PROPOSAL`
                      }));
                    }}
                    placeholder="DIGITAL MARKETING"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase text-violet-600 dark:text-violet-400 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Type here to change what kind of proposal this is.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Full Proposal Header Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="DIGITAL MARKETING PROPOSAL"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Total Cost
                  </label>
                  <input
                    type="text"
                    value={formData.totalCost}
                    onChange={e => setFormData({ ...formData, totalCost: e.target.value })}
                    placeholder="Rs 13,200"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-emerald-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. GOALS & 5 OBJECTIVES */}
          {activeSection === 'goals' && (
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Executive Campaign Goal
                </label>
                <textarea
                  rows={3}
                  value={formData.campaignGoal}
                  onChange={e => setFormData({ ...formData, campaignGoal: e.target.value })}
                  placeholder="Summarize the core campaign purpose and target results..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs leading-relaxed outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Campaign Objectives ({formData.objectives.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="px-3 py-1 bg-violet-600/10 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-violet-600/20"
                  >
                    <Plus size={14} /> Add Objective
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.objectives.map((obj, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={obj.title}
                          onChange={e => handleObjectiveChange(idx, 'title', e.target.value)}
                          placeholder="e.g. 01. BRAND POSITIONING"
                          className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold uppercase outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveObjective(idx)}
                          className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={obj.description}
                        onChange={e => handleObjectiveChange(idx, 'description', e.target.value)}
                        placeholder="Description of this objective..."
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. PLATFORMS & BENEFITS */}
          {activeSection === 'platforms' && (
            <div className="space-y-6">
              {/* Platforms */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Platforms Covered
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPlatform}
                    className="px-3 py-1 bg-violet-600/10 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-violet-600/20"
                  >
                    <Plus size={14} /> Add Platform
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.platforms.map((plat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={plat}
                        onChange={e => handlePlatformChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePlatform(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Benefits for {formData.clientName || 'Client'} ({formData.benefits.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-3 py-1 bg-violet-600/10 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-violet-600/20"
                  >
                    <Plus size={14} /> Add Benefit
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={b}
                        onChange={e => handleBenefitChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. SERVICES INCLUDED */}
          {activeSection === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Services Included ({formData.services.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-3 py-1 bg-violet-600/10 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-violet-600/20"
                >
                  <Plus size={14} /> Add Service
                </button>
              </div>

              <div className="space-y-3">
                {formData.services.map((srv, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={srv.title}
                        onChange={e => handleServiceChange(idx, 'title', e.target.value)}
                        placeholder="SERVICE TITLE"
                        className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold uppercase outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={srv.description}
                      onChange={e => handleServiceChange(idx, 'description', e.target.value)}
                      placeholder="Service scope and details..."
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. COMMERCIALS & TERMS */}
          {activeSection === 'commercials' && (
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Deliverables & Creative Plan Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.planDeliverables}
                  onChange={e => setFormData({ ...formData, planDeliverables: e.target.value })}
                  placeholder="e.g. Creative Posters - 12 | AI Videos - 04&#10;Meta Ad - 30 days | Social Media Handling - 30 days"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Total Pricing
                </label>
                <input
                  type="text"
                  value={formData.totalCost}
                  onChange={e => setFormData({ ...formData, totalCost: e.target.value })}
                  placeholder="Rs 13,200"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-emerald-600 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Terms & Conditions ({formData.termsAndConditions.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTerm}
                    className="px-3 py-1 bg-violet-600/10 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-violet-600/20"
                  >
                    <Plus size={14} /> Add Condition
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.termsAndConditions.map((term, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={term}
                        onChange={e => handleTermChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTerm(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/20 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving...' : proposal ? 'Update Proposal' : 'Create Proposal'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
