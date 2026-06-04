// Stateful mock database for development
export const mockUsers = {
  'cxo@awaas.com': {
    password: 'password',
    token: 'mock-jwt-token-cxo',
    role: 'cxo',
    scope: { project_ids: ['emerald-heights', 'sapphire-towers'] },
    user: {
      email: 'cxo@awaas.com',
      name: 'Aditya Birla',
      company_name: 'Birla Estates'
    }
  },
  'builder@awaas.com': {
    password: 'password',
    token: 'mock-jwt-token-builder',
    role: 'builder',
    scope: { project_ids: ['emerald-heights'] },
    user: {
      email: 'builder@awaas.com',
      name: 'Rohan Shah',
      company_name: 'Birla Estates'
    }
  },
  'saleshead@awaas.com': {
    password: 'password',
    token: 'mock-jwt-token-saleshead',
    role: 'sales_head',
    scope: { project_ids: ['emerald-heights'], salesperson_id: 'sales-head-1' },
    user: {
      email: 'saleshead@awaas.com',
      name: 'Vikram Malhotra',
      company_name: 'Birla Estates'
    }
  },
  'salesexec@awaas.com': {
    password: 'password',
    token: 'mock-jwt-token-salesexec',
    role: 'sales_exec',
    scope: { project_ids: ['emerald-heights'], salesperson_id: 'sales-rep-1' },
    user: {
      email: 'salesexec@awaas.com',
      name: 'Neha Sharma',
      company_name: 'Birla Estates'
    }
  },
  'admin@awaas.com': {
    password: 'password',
    token: 'mock-jwt-token-admin',
    role: 'awaas_admin',
    scope: { project_ids: ['emerald-heights', 'sapphire-towers', 'ruby-residences'] },
    user: {
      email: 'admin@awaas.com',
      name: 'AWAAS System Admin',
      company_name: 'AWAAS Tech'
    }
  }
}

export const mockProjects = [
  { project_id: 'emerald-heights', name: 'Emerald Heights', location: 'Gurugram, Sector 62', price_band: '₹2.5 Cr - ₹4.0 Cr', flat_count: 12 },
  { project_id: 'sapphire-towers', name: 'Sapphire Towers', location: 'Mumbai, Lower Parel', price_band: '₹5.0 Cr - ₹8.5 Cr', flat_count: 8 },
  { project_id: 'ruby-residences', name: 'Ruby Residences', location: 'Bengaluru, Whitefield', price_band: '₹1.8 Cr - ₹3.0 Cr', flat_count: 10 }
]

export const mockProjectOverviews = {
  'emerald-heights': {
    engagement_score: 72.4,
    engagement_trend_pct: 8.5,
    drop_off_risk: 'MEDIUM',
    drop_off_pct: 28.3,
    top_buyer_driver: { feature: 'Sunlight & Ventilation', influence_pct: 68 },
    weakest_area: { room: 'Kitchen Utility', avg_dwell_pct: 8.2 },
    session_count: 312,
    avg_duration_sec: 845,
    avg_completion_pct: 74.2,
    feature_usage: [
      { feature: 'Living Room', usage_pct: 28 },
      { feature: 'Balcony', usage_pct: 22 },
      { feature: 'Master Bedroom', usage_pct: 18 },
      { feature: 'Kitchen', usage_pct: 16 },
      { feature: 'Vastu Entry', usage_pct: 9 },
      { feature: 'Smart Home', usage_pct: 7 }
    ],
    session_volume: [
      { label: 'W1', sessions: 22 }, { label: 'W2', sessions: 26 }, { label: 'W3', sessions: 24 },
      { label: 'W4', sessions: 31 }, { label: 'W5', sessions: 29 }, { label: 'W6', sessions: 34 },
      { label: 'W7', sessions: 33 }, { label: 'W8', sessions: 36 }, { label: 'W9', sessions: 38 },
      { label: 'W10', sessions: 39 }
    ],
    sparkline: [62, 65, 61, 68, 70, 69, 73, 71, 72, 75]
  },
  'sapphire-towers': {
    engagement_score: 84.1,
    engagement_trend_pct: 12.2,
    drop_off_risk: 'LOW',
    drop_off_pct: 14.5,
    top_buyer_driver: { feature: 'Balcony Sea View', influence_pct: 85 },
    weakest_area: { room: 'Guest Bedroom', avg_dwell_pct: 5.4 },
    session_count: 184,
    avg_duration_sec: 1042,
    avg_completion_pct: 86.1,
    feature_usage: [
      { feature: 'Balcony', usage_pct: 34 },
      { feature: 'Living Room', usage_pct: 24 },
      { feature: 'Master Bedroom', usage_pct: 16 },
      { feature: 'Private Lift', usage_pct: 12 },
      { feature: 'Kitchen', usage_pct: 9 },
      { feature: 'Vastu Entry', usage_pct: 5 }
    ],
    session_volume: [
      { label: 'W1', sessions: 12 }, { label: 'W2', sessions: 14 }, { label: 'W3', sessions: 16 },
      { label: 'W4', sessions: 15 }, { label: 'W5', sessions: 18 }, { label: 'W6', sessions: 19 },
      { label: 'W7', sessions: 21 }, { label: 'W8', sessions: 20 }, { label: 'W9', sessions: 23 },
      { label: 'W10', sessions: 26 }
    ],
    sparkline: [78, 80, 81, 79, 83, 82, 85, 84, 86, 84]
  },
  'ruby-residences': {
    engagement_score: 58.6,
    engagement_trend_pct: -3.4,
    drop_off_risk: 'HIGH',
    drop_off_pct: 42.1,
    top_buyer_driver: { feature: 'Vastu Compliant Layout', influence_pct: 59 },
    weakest_area: { room: 'Home Office Space', avg_dwell_pct: 4.1 },
    session_count: 245,
    avg_duration_sec: 612,
    avg_completion_pct: 58.7,
    feature_usage: [
      { feature: 'Living Room', usage_pct: 30 },
      { feature: 'Vastu Entry', usage_pct: 21 },
      { feature: 'Master Bedroom', usage_pct: 17 },
      { feature: 'Kitchen', usage_pct: 15 },
      { feature: 'Balcony', usage_pct: 10 },
      { feature: 'Home Office', usage_pct: 7 }
    ],
    session_volume: [
      { label: 'W1', sessions: 30 }, { label: 'W2', sessions: 29 }, { label: 'W3', sessions: 27 },
      { label: 'W4', sessions: 28 }, { label: 'W5', sessions: 25 }, { label: 'W6', sessions: 24 },
      { label: 'W7', sessions: 23 }, { label: 'W8', sessions: 21 }, { label: 'W9', sessions: 20 },
      { label: 'W10', sessions: 18 }
    ],
    sparkline: [65, 63, 62, 60, 59, 58, 59, 57, 58, 59]
  }
}

export const mockFlatTiles = {
  'emerald-heights': [
    { flat_id: 'eh-101', flat_number: '3BHK-101', config: '3BHK', engagement_score: 78, completion_pct: 82, risk: 'GREEN', trend_pct: 5.2, primary_issue: 'None', suggested_action: 'None' },
    { flat_id: 'eh-102', flat_number: '3BHK-102', config: '3BHK', engagement_score: 71, completion_pct: 76, risk: 'GREEN', trend_pct: 2.1, primary_issue: 'None', suggested_action: 'None' },
    { flat_id: 'eh-103', flat_number: '2BHK-103', config: '2BHK', engagement_score: 65, completion_pct: 68, risk: 'AMBER', trend_pct: -1.5, primary_issue: 'Living area drop-off', suggested_action: 'Pitch sunset views' },
    { flat_id: 'eh-104', flat_number: '2BHK-104', config: '2BHK', engagement_score: 62, completion_pct: 64, risk: 'AMBER', trend_pct: -3.0, primary_issue: 'Vastu mismatch in entry', suggested_action: 'Show alternative layouts' },
    { flat_id: 'eh-201', flat_number: '3BHK-201', config: '3BHK', engagement_score: 83, completion_pct: 88, risk: 'GREEN', trend_pct: 9.4, primary_issue: 'None', suggested_action: 'None' },
    { flat_id: 'eh-202', flat_number: '3BHK-202', config: '3BHK', engagement_score: 76, completion_pct: 80, risk: 'GREEN', trend_pct: 4.0, primary_issue: 'None', suggested_action: 'None' },
    { flat_id: 'eh-203', flat_number: '2BHK-203', config: '2BHK', engagement_score: 55, completion_pct: 58, risk: 'AMBER', trend_pct: -6.2, primary_issue: 'Kitchen ignored (80% sessions)', suggested_action: 'Highlight premium fittings' },
    { flat_id: 'eh-204', flat_number: '2BHK-204', config: '2BHK', engagement_score: 48, completion_pct: 51, risk: 'AMBER', trend_pct: -4.8, primary_issue: 'Balcony size concern', suggested_action: 'Emphasize space optimization' },
    { flat_id: 'eh-301', flat_number: '4BHK-301', config: '4BHK', engagement_score: 88, completion_pct: 91, risk: 'GREEN', trend_pct: 11.1, primary_issue: 'None', suggested_action: 'None' },
    { flat_id: 'eh-302', flat_number: '4BHK-302', config: '4BHK', engagement_score: 35, completion_pct: 37, risk: 'RED', trend_pct: -12.4, primary_issue: 'High entry drop-off (45%)', suggested_action: 'Check render lighting quality' },
    { flat_id: 'eh-303', flat_number: '3BHK-303', config: '3BHK', engagement_score: 39, completion_pct: 42, risk: 'RED', trend_pct: -9.8, primary_issue: 'Master bedroom layout complaints', suggested_action: 'Provide virtual fit-out options' },
    { flat_id: 'eh-304', flat_number: '3BHK-304', config: '3BHK', engagement_score: 81, completion_pct: 85, risk: 'GREEN', trend_pct: 6.7, primary_issue: 'None', suggested_action: 'None' }
  ],
  'sapphire-towers': [
    { flat_id: 'st-1101', flat_number: '4BHK-1101', config: '4BHK', engagement_score: 89, completion_pct: 93, risk: 'GREEN', trend_pct: 6.8, primary_issue: 'None', suggested_action: 'None' },
    { flat_id: 'st-1102', flat_number: '4BHK-1102', config: '4BHK', engagement_score: 85, completion_pct: 89, risk: 'GREEN', trend_pct: 3.5, primary_issue: 'None', suggested_action: 'None' },
    { flat_id: 'st-1201', flat_number: '3BHK-1201', config: '3BHK', engagement_score: 79, completion_pct: 83, risk: 'GREEN', trend_pct: 4.1, primary_issue: 'None', suggested_action: 'None' },
    { flat_id: 'st-1202', flat_number: '3BHK-1202', config: '3BHK', engagement_score: 72, completion_pct: 77, risk: 'GREEN', trend_pct: 1.0, primary_issue: 'None', suggested_action: 'None' },
    { flat_id: 'st-1301', flat_number: '3BHK-1301', config: '3BHK', engagement_score: 66, completion_pct: 70, risk: 'AMBER', trend_pct: -2.3, primary_issue: 'High cost concern', suggested_action: 'Focus on payment flexibility' },
    { flat_id: 'st-1302', flat_number: '3BHK-1302', config: '3BHK', engagement_score: 61, completion_pct: 65, risk: 'AMBER', trend_pct: -4.0, primary_issue: 'Lobby entry dark', suggested_action: 'Brighten visual render maps' },
    { flat_id: 'st-1401', flat_number: '4BHK-1401', config: '4BHK', engagement_score: 92, completion_pct: 95, risk: 'GREEN', trend_pct: 10.5, primary_issue: 'None', suggested_action: 'None' },
    { flat_id: 'st-1402', flat_number: '4BHK-1402', config: '4BHK', engagement_score: 38, completion_pct: 40, risk: 'RED', trend_pct: -15.0, primary_issue: 'Elevator noise render bug', suggested_action: 'Fix spatial audio levels' }
  ]
}

export const mockFlatDeepDives = {
  'eh-101': {
    flat_number: '3BHK-101',
    engagement_trend: [72, 74, 73, 75, 76, 75, 78, 77, 79, 78],
    drop_off_rate: 12.5,
    session_count: 48,
    room_breakdown: [
      { room: 'Living Room', pct: 35 },
      { room: 'Balcony', pct: 25 },
      { room: 'Master Bedroom', pct: 20 },
      { room: 'Kitchen', pct: 15 },
      { room: 'Vastu Entry', pct: 5 }
    ],
    issues: ['None detected'],
    suggested_actions: [
      { text: 'Keep highlighting sunset vistas in Balcony', impact: 'low' },
      { text: 'Engage with premium layout features of Living Room', impact: 'low' }
    ]
  },
  'eh-103': {
    flat_number: '2BHK-103',
    engagement_trend: [70, 68, 69, 67, 66, 68, 65, 64, 65, 65],
    drop_off_rate: 32.1,
    session_count: 38,
    room_breakdown: [
      { room: 'Living Room', pct: 45 },
      { room: 'Balcony', pct: 10 },
      { room: 'Master Bedroom', pct: 22 },
      { room: 'Kitchen', pct: 18 },
      { room: 'Vastu Entry', pct: 5 }
    ],
    issues: [
      'Early session drop-off (Living Room has 45% of time, but Balcony has only 10% which is low)',
      'Visitors exit quickly after walking through main entrance'
    ],
    suggested_actions: [
      { text: 'Reposition the VR spawn point directly to the Balcony to capture attention', impact: 'high' },
      { text: 'Adjust lighting brightness in the entryway render', impact: 'medium' }
    ]
  },
  'eh-203': {
    flat_number: '2BHK-203',
    engagement_trend: [64, 62, 60, 59, 58, 57, 59, 56, 55, 55],
    drop_off_rate: 39.4,
    session_count: 42,
    room_breakdown: [
      { room: 'Living Room', pct: 40 },
      { room: 'Balcony', pct: 28 },
      { room: 'Master Bedroom', pct: 20 },
      { room: 'Kitchen', pct: 8 },
      { room: 'Bathroom', pct: 4 }
    ],
    issues: [
      'Kitchen ignored by over 80% of session visitors',
      'High conversion leakage at kitchen walkthrough'
    ],
    suggested_actions: [
      { text: 'Showcase utility storage extensions via hover popup widgets in VR', impact: 'high' },
      { text: 'Prompt sales execs to guide users into the kitchen explicitly', impact: 'medium' }
    ]
  },
  'eh-302': {
    flat_number: '4BHK-302',
    engagement_trend: [55, 50, 48, 45, 42, 40, 38, 36, 35, 35],
    drop_off_rate: 64.8,
    session_count: 29,
    room_breakdown: [
      { room: 'Living Room', pct: 55 },
      { room: 'Vastu Entry', pct: 28 },
      { room: 'Master Bedroom', pct: 10 },
      { room: 'Kitchen', pct: 5 },
      { room: 'Balcony', pct: 2 }
    ],
    issues: [
      'Extreme drop-off in first 45 seconds of simulation',
      'Vastu Entry has low light levels causing user disorientation'
    ],
    suggested_actions: [
      { text: 'Rebuild VR panoramic lighting map for North-Facing Entry', impact: 'high' },
      { text: 'Provide immediate virtual assistant greeting at entry point', impact: 'medium' }
    ]
  }
}

// Fallback generator for un-mocked flats
export function getFlatDeepDive(flatId, flatNumber = 'Flat') {
  if (mockFlatDeepDives[flatId]) return mockFlatDeepDives[flatId]
  return {
    flat_number: flatNumber,
    engagement_trend: [60, 62, 61, 65, 63, 67, 68, 65, 68, 70],
    drop_off_rate: 20.0,
    session_count: 15,
    room_breakdown: [
      { room: 'Living Room', pct: 40 },
      { room: 'Master Bedroom', pct: 30 },
      { room: 'Kitchen', pct: 15 },
      { room: 'Balcony', pct: 10 },
      { room: 'Vastu Entry', pct: 5 }
    ],
    issues: ['No critical issues detected'],
    suggested_actions: [
      { text: 'Maintain current pitch sequence', impact: 'low' }
    ]
  }
}

export const mockSegmentInsights = {
  'emerald-heights': {
    matrix: [
      { segment: 'IT Professionals', rooms: { living: 34, balcony: 28, kitchen: 14, vastu: 8, bedroom: 16 } },
      { segment: 'Self-Employed / Traders', rooms: { living: 25, balcony: 15, kitchen: 10, vastu: 35, bedroom: 15 } },
      { segment: 'Corporate Executives', rooms: { living: 40, balcony: 20, kitchen: 12, vastu: 5, bedroom: 23 } },
      { segment: 'Retirees / Seniors', rooms: { living: 28, balcony: 32, kitchen: 20, vastu: 12, bedroom: 8 } }
    ],
    feature_sensitivity: [
      { feature: 'Natural Sunlight', score_pct: 82 },
      { feature: 'Vastu Direction', score_pct: 64 },
      { feature: 'Balcony Open Space', score_pct: 78 },
      { feature: 'Kitchen Storage Space', score_pct: 45 },
      { feature: 'Acoustic Insulation', score_pct: 35 }
    ],
    // Module 6 §8.1 Segment View — three dimensions
    segment_dimensions: {
      work_profile: {
        row_header: 'Work Profile',
        caption: 'Work Profile vs Room Engagement (% avg dwell time)',
        columns: [
          { key: 'living', label: 'Living' }, { key: 'balcony', label: 'Balcony' },
          { key: 'kitchen', label: 'Kitchen' }, { key: 'vastu', label: 'Vastu' },
          { key: 'bedroom', label: 'Bedroom' }
        ],
        rows: [
          { label: 'IT Professionals', values: { living: 34, balcony: 28, kitchen: 14, vastu: 8, bedroom: 16 } },
          { label: 'Self-Employed / Traders', values: { living: 25, balcony: 15, kitchen: 10, vastu: 35, bedroom: 15 } },
          { label: 'Corporate Executives', values: { living: 40, balcony: 20, kitchen: 12, vastu: 5, bedroom: 23 } },
          { label: 'Retirees / Seniors', values: { living: 28, balcony: 32, kitchen: 20, vastu: 12, bedroom: 8 } }
        ]
      },
      age_bracket: {
        row_header: 'Age Bracket',
        caption: 'Age Bracket vs Feature Interaction (% sessions interacting)',
        columns: [
          { key: 'sunlight', label: 'Sunlight' }, { key: 'balcony', label: 'Balcony' },
          { key: 'smart_home', label: 'Smart Home' }, { key: 'vastu', label: 'Vastu' },
          { key: 'storage', label: 'Storage' }
        ],
        rows: [
          { label: '25 – 34', values: { sunlight: 30, balcony: 26, smart_home: 38, vastu: 10, storage: 18 } },
          { label: '35 – 44', values: { sunlight: 36, balcony: 30, smart_home: 24, vastu: 22, storage: 28 } },
          { label: '45 – 54', values: { sunlight: 32, balcony: 22, smart_home: 14, vastu: 34, storage: 30 } },
          { label: '55+', values: { sunlight: 28, balcony: 24, smart_home: 8, vastu: 42, storage: 20 } }
        ]
      },
      lead_source: {
        row_header: 'Lead Source',
        caption: 'Lead Source vs Session Engagement',
        columns: [
          { key: 'engagement', label: 'Avg Engagement' }, { key: 'completion', label: 'Completion' },
          { key: 'session_share', label: 'Session Share' }
        ],
        rows: [
          { label: 'Portal (99acres)', values: { engagement: 71, completion: 74, session_share: 34 } },
          { label: 'Walk-in', values: { engagement: 78, completion: 82, session_share: 22 } },
          { label: 'Referral', values: { engagement: 83, completion: 86, session_share: 18 } },
          { label: 'Social Ads', values: { engagement: 62, completion: 60, session_share: 16 } },
          { label: 'Broker', values: { engagement: 68, completion: 70, session_share: 10 } }
        ]
      }
    }
  },
  'sapphire-towers': {
    matrix: [
      { segment: 'HNIs / Investors', rooms: { living: 42, balcony: 35, kitchen: 8, vastu: 2, bedroom: 13 } },
      { segment: 'Creative Professionals', rooms: { living: 35, balcony: 30, kitchen: 15, vastu: 5, bedroom: 15 } },
      { segment: 'NRIs', rooms: { living: 30, balcony: 25, kitchen: 10, vastu: 15, bedroom: 20 } }
    ],
    feature_sensitivity: [
      { feature: 'Scenic Balcony Sea-View', score_pct: 95 },
      { feature: 'Premium Brand Fittings', score_pct: 72 },
      { feature: 'Vastu Entrance Align', score_pct: 38 },
      { feature: 'Private Elevator Access', score_pct: 80 }
    ],
    segment_dimensions: {
      work_profile: {
        row_header: 'Work Profile',
        caption: 'Work Profile vs Room Engagement (% avg dwell time)',
        columns: [
          { key: 'living', label: 'Living' }, { key: 'balcony', label: 'Balcony' },
          { key: 'kitchen', label: 'Kitchen' }, { key: 'vastu', label: 'Vastu' },
          { key: 'bedroom', label: 'Bedroom' }
        ],
        rows: [
          { label: 'HNIs / Investors', values: { living: 42, balcony: 35, kitchen: 8, vastu: 2, bedroom: 13 } },
          { label: 'Creative Professionals', values: { living: 35, balcony: 30, kitchen: 15, vastu: 5, bedroom: 15 } },
          { label: 'NRIs', values: { living: 30, balcony: 25, kitchen: 10, vastu: 15, bedroom: 20 } }
        ]
      },
      age_bracket: {
        row_header: 'Age Bracket',
        caption: 'Age Bracket vs Feature Interaction (% sessions interacting)',
        columns: [
          { key: 'sea_view', label: 'Sea View' }, { key: 'fittings', label: 'Fittings' },
          { key: 'private_lift', label: 'Private Lift' }, { key: 'vastu', label: 'Vastu' },
          { key: 'storage', label: 'Storage' }
        ],
        rows: [
          { label: '30 – 39', values: { sea_view: 44, fittings: 30, private_lift: 28, vastu: 8, storage: 16 } },
          { label: '40 – 49', values: { sea_view: 40, fittings: 36, private_lift: 34, vastu: 14, storage: 22 } },
          { label: '50 – 59', values: { sea_view: 38, fittings: 28, private_lift: 30, vastu: 26, storage: 24 } },
          { label: '60+', values: { sea_view: 34, fittings: 22, private_lift: 26, vastu: 32, storage: 18 } }
        ]
      },
      lead_source: {
        row_header: 'Lead Source',
        caption: 'Lead Source vs Session Engagement',
        columns: [
          { key: 'engagement', label: 'Avg Engagement' }, { key: 'completion', label: 'Completion' },
          { key: 'session_share', label: 'Session Share' }
        ],
        rows: [
          { label: 'Portal (Housing)', values: { engagement: 80, completion: 84, session_share: 30 } },
          { label: 'Walk-in', values: { engagement: 85, completion: 88, session_share: 20 } },
          { label: 'Referral', values: { engagement: 89, completion: 92, session_share: 24 } },
          { label: 'Social Ads', values: { engagement: 70, completion: 68, session_share: 14 } },
          { label: 'Channel Partner', values: { engagement: 76, completion: 79, session_share: 12 } }
        ]
      }
    }
  }
}

// Global action recommendations state to allow marking/assigning in-memory
export let mockActionRecommendations = [
  { id: 'rec-1', flat_id: 'eh-103', problem: '2BHK-103 — High drop-off in living area (32%)', fix: 'Reposition VR startup camera; pitch evening sunset balcony views.', priority: 'high', status: 'open' },
  { id: 'rec-2', flat_id: 'eh-203', problem: '2BHK-203 — Kitchen ignored by 80% of buyers', fix: 'Add interactive kitchen cabinet animation hot-spots.', priority: 'medium', status: 'assigned' },
  { id: 'rec-3', flat_id: 'eh-302', problem: '4BHK-302 — Entryway drop-off rate of 64%', fix: 'Boost lighting rendering maps for North-Facing Entry.', priority: 'high', status: 'open' },
  { id: 'rec-4', flat_id: 'eh-104', problem: '2BHK-104 — Vastu complaints at foyer entrance', fix: 'Instruct agents to redirect pitch to modular layout plan.', priority: 'low', status: 'actioned' }
]

export function updateRecommendationStatus(id, status) {
  mockActionRecommendations = mockActionRecommendations.map(rec => 
    rec.id === id ? { ...rec, status } : rec
  )
}

export const mockSalesSummary = {
  sessions_handled: 54,
  sessions_trend_pct: 6.4,
  avg_engagement: 74.5,
  avg_duration_sec: 768,
  completion_pct: 79.3,
  conversion_corr: 0.68,
  prompt_usage_pct: 82.5,
  archetype_breakdown: {
    exploratory: 40,
    comparative: 30,
    confirmatory: 20,
    disengaged: 10
  },
  top_objections: [
    'Kitchen lacks chimney exhaust render details',
    'Living room layout feels congested for larger sofas',
    'Balcony safety railings height concerns'
  ]
}

// Per-salesperson individual summaries, keyed by scope.salesperson_id.
// Lets each logged-in rep see their OWN numbers (falls back to mockSalesSummary).
export const mockSalesSummaries = {
  // Sales Executive — Neha Sharma (strong individual performer)
  'sales-rep-1': {
    sessions_handled: 31,
    sessions_trend_pct: 9.1,
    avg_engagement: 81.0,
    avg_duration_sec: 902,
    completion_pct: 88.5,
    conversion_corr: 0.74,
    prompt_usage_pct: 90,
    archetype_breakdown: { exploratory: 35, comparative: 32, confirmatory: 25, disengaged: 8 },
    top_objections: [
      'Premium pricing compared to nearby projects',
      'Requests for higher-floor units only',
      'Possession timeline needs clarity'
    ]
  },
  // Sales Manager — Vikram Malhotra (own pitches, separate from his team view)
  'sales-head-1': {
    sessions_handled: 19,
    sessions_trend_pct: 3.5,
    avg_engagement: 76.8,
    avg_duration_sec: 1015,
    completion_pct: 83.0,
    conversion_corr: 0.70,
    prompt_usage_pct: 80,
    archetype_breakdown: { exploratory: 42, comparative: 28, confirmatory: 18, disengaged: 12 },
    top_objections: [
      'Home-loan eligibility questions',
      'Vastu concerns on east-facing units',
      'Clubhouse amenities scope'
    ]
  }
}

export const mockTeamSummary = {
  reps: [
    { id: 'rep-1', name: 'Neha Sharma', sessions: 28, avg_engagement: 78.2, prompt_usage_pct: 85, completion_pct: 90, conversion_corr: 0.72 },
    { id: 'rep-2', name: 'Karan Malhotra', sessions: 22, avg_engagement: 71.4, prompt_usage_pct: 76, completion_pct: 85, conversion_corr: 0.64 },
    { id: 'rep-3', name: 'Sanjay Dutt', sessions: 18, avg_engagement: 62.5, prompt_usage_pct: 54, completion_pct: 68, conversion_corr: 0.48 }, // Training flag trigger
    { id: 'rep-4', name: 'Priya Patel', sessions: 32, avg_engagement: 81.0, prompt_usage_pct: 92, completion_pct: 94, conversion_corr: 0.79 }
  ]
}

export const mockDataHealth = {
  sessions_per_project: [
    { project_id: 'emerald-heights', count: 312, trend_pct: 8.5 },
    { project_id: 'sapphire-towers', count: 184, trend_pct: 12.2 },
    { project_id: 'ruby-residences', count: 245, trend_pct: -3.4 }
  ],
  event_completeness_pct: 98.4,
  sync_failure_rate: 0.12,
  alerts: [
    'Ruby Residences sync delay detected on 2026-05-25',
    'Low event count warning from headset #04'
  ],
  // Module 6 §8.3 Data Operations — audio file storage status
  audio_storage: {
    total_files: 1287,
    used_gb: 42.6,
    capacity_gb: 100,
    uploaded_today: 38,
    pending_sync: 11,
    failed_uploads: 4
  },
  // Module 6 §8.3 Analytics — zone attention distribution across projects (% dwell share)
  zone_attention: [
    { project_id: 'emerald-heights', living: 32, balcony: 24, kitchen: 14, bedroom: 20, vastu: 10 },
    { project_id: 'sapphire-towers', living: 38, balcony: 30, kitchen: 9, bedroom: 16, vastu: 7 },
    { project_id: 'ruby-residences', living: 30, balcony: 14, kitchen: 16, bedroom: 19, vastu: 21 }
  ],
  // Module 6 §8.3 Analytics — data quality validation reports
  validation_reports: [
    { check: 'Session ID uniqueness', status: 'pass', detail: '0 duplicates across 741 sessions' },
    { check: 'Gaze packet integrity', status: 'pass', detail: '98.4% packets complete' },
    { check: 'Timestamp ordering', status: 'pass', detail: 'All event sequences monotonic' },
    { check: 'Orphaned events', status: 'warn', detail: '23 events without a parent session' },
    { check: 'Audio–session linkage', status: 'fail', detail: '4 audio files missing session reference' }
  ]
}

export const mockRenderComparison = {
  panoramic: {
    avg_engagement: 64.2,
    avg_completion: 71.5,
    session_count: 420
  },
  threeD: {
    avg_engagement: 78.6,
    avg_completion: 86.4,
    session_count: 321
  }
}

// Helper to generate CSV strings
export function getMockSessionsCsv(projectId) {
  return `session_id,player_name,salesperson_name,engagement_score,archetype,duration_seconds,timestamp
s-101,Aarav Mehta,Neha Sharma,82,Exploratory,912,2026-05-24T10:14:00Z
s-102,Ishita Sen,Karan Malhotra,54,Disengaged,320,2026-05-24T11:45:00Z
s-103,Rohan Roy,Neha Sharma,78,Comparative,784,2026-05-24T14:20:00Z
s-104,Priya Das,Sanjay Dutt,61,Confirmatory,640,2026-05-25T09:30:00Z`
}

export function getMockEventsCsv(projectId) {
  return `event_id,session_id,event_type,room_name,target_object,dwell_time_ms,timestamp
e-5001,s-101,enter_room,Living Room,,0,2026-05-24T10:14:02Z
e-5002,s-101,gaze_start,Living Room,Sunlight Window,8500,2026-05-24T10:14:15Z
e-5003,s-101,enter_room,Balcony,,0,2026-05-24T10:16:30Z
e-5004,s-101,gaze_start,Balcony,Railing,4200,2026-05-24T10:16:45Z`
}
