"use client";
import React, { useState, useEffect } from 'react';
import * as UI from '@/components/lib';

const RenderEngine = ({ components = [] }) => {
    if (!components || components.length === 0) return null;
    const renderComponent = (config, index) => {
        const { type, props, id } = config;
        const Component = UI[type];
        const uniqueKey = id ? `${id}-${index}` : `component-${index}`;

        if (!Component) return <div key={uniqueKey} style={{ color: '#ef4444', fontSize: '11px', padding: '10px' }}>! Component not found: {type}</div>;

        let childrenToRender = null;

        // Prop cleaning: separate children/components from DOM props
        const { components: nestedComponents, children: rawChildren, ...domProps } = props || {};

        if (nestedComponents && Array.isArray(nestedComponents)) {
            // 1. Explicit 'components' array
            childrenToRender = nestedComponents.map((child, i) => renderComponent(child, i));
        } else if (Array.isArray(rawChildren)) {
            // 2. 'children' is an array of objects (AI hallucination) or strings
            childrenToRender = rawChildren.map((child, i) => {
                if (typeof child === 'object' && child !== null && child.type) {
                    return renderComponent(child, i);
                }
                return child;
            });
        } else if (typeof rawChildren === 'object' && rawChildren !== null && rawChildren.type) {
            // 3. 'children' is a single component object
            childrenToRender = renderComponent(rawChildren, 0);
        } else {
            // 4. 'children' is simple text/primitive
            childrenToRender = rawChildren;
        }

        return <Component key={uniqueKey} {...domProps}>{childrenToRender}</Component>;
    };
    return <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>{components.map((config, i) => renderComponent(config, i))}</div>;
};

export default function HomePage() {
    const [intent, setIntent] = useState('');
    const [history, setHistory] = useState([]);
    const [currentUI, setCurrentUI] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedTurn, setExpandedTurn] = useState(null);

    const handleGenerate = async (overriddenIntent) => {
        const finalIntent = overriddenIntent || intent;
        if (!finalIntent) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    intent: finalIntent,
                    previousPlan: history[history.length - 1]?.plan || null,
                    previousCode: history[history.length - 1]?.code || null
                })
            });
            const data = await response.json();
            if (data.error) {
                alert(`Agent Error: ${data.error}`);
                setIsLoading(false);
                return;
            }
            setCurrentUI(data);
            setHistory(prev => [...prev, { ...data, userIntent: finalIntent }]);
            setExpandedTurn(history.length);
            setIntent('');
        } catch (error) {
            console.error('Failed to generate UI', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRollback = () => {
        if (history.length > 1) {
            const newHistory = history.slice(0, -1);
            setHistory(newHistory);
            setCurrentUI(newHistory[newHistory.length - 1]);
            setExpandedTurn(newHistory.length - 1);
        } else if (history.length === 1) {
            setHistory([]);
            setCurrentUI(null);
            setExpandedTurn(null);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#050505', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <div style={{ height: '48px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', backgroundColor: '#080808' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#00e5ff', fontSize: '18px' }}>✦</div>
                    <div style={{ fontSize: '14px', fontWeight: '800' }}>Ryze UI Agent <span style={{ fontWeight: '400', fontSize: '11px', marginLeft: '8px', opacity: 0.5 }}>Deterministic AI UI Generator</span></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }}></div> Agent Ready
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Panel */}
                <div style={{ width: '300px', backgroundColor: '#0a0a0c', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#888' }}>
                                <span>🤖</span> AI Agent
                            </div>
                            {history.length > 0 && (
                                <button
                                    onClick={handleRollback}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                    title="Rollback"
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.color = '#e2e8f0';
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.color = '#64748b';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    ↺
                                </button>
                            )}
                        </div>

                        {history.length === 0 ? (
                            <div style={{ height: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', marginBottom: '16px', opacity: 0.8 }}>🤖</div>
                                <div style={{ fontSize: '13px', fontWeight: '500', color: '#94a3b8', marginBottom: '20px' }}>Describe the UI you want to build</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {["Create a dashboard", "Build a settings form", "Make a landing page"].map((s, i) => (
                                        <button key={i} className="suggestion-pill" onClick={() => handleGenerate(s)} style={{ padding: '8px 16px', fontSize: '11px', border: '1px solid #222', background: 'transparent', borderRadius: '20px', color: '#64748b' }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '0 12px' }}>
                                {history.map((item, i) => (
                                    <div key={i} style={{ marginBottom: '4px' }}>
                                        <div
                                            onClick={() => setExpandedTurn(expandedTurn === i ? null : i)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '6px', cursor: 'pointer', backgroundColor: expandedTurn === i ? '#161618' : 'transparent' }}
                                        >
                                            <span style={{ fontSize: '14px', opacity: expandedTurn === i ? 1 : 0.5 }}>{expandedTurn === i ? '✨' : '📄'}</span>
                                            <div style={{ fontSize: '12px', fontWeight: '500', color: expandedTurn === i ? '#eee' : '#64748b' }}>{item.userIntent}</div>
                                        </div>
                                        {expandedTurn === i && (
                                            <div style={{ marginLeft: '32px', borderLeft: '1px solid #222', padding: '8px 0 12px 12px' }}>
                                                <div style={{ fontSize: '11px', color: '#444', fontWeight: '700', marginBottom: '6px' }}>› Agent Plan</div>
                                                <div style={{ fontSize: '11px', color: '#444', fontWeight: '700', marginBottom: '10px' }}>› Decisions</div>
                                                <div style={{ fontSize: '11px', color: '#888', lineHeight: '1.5', paddingRight: '10px' }}>{item.explanation}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '16px', borderTop: '1px solid #1a1a1a', background: '#080808' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <textarea
                                value={intent}
                                onChange={(e) => setIntent(e.target.value)}
                                style={{ width: '100%', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '12px 48px 12px 16px', fontSize: '12px', color: '#fff', outline: 'none', resize: 'none', height: '44px', display: 'flex', alignItems: 'center', lineHeight: '20px' }}
                                placeholder="Describe your UI..."
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                            />
                            <button
                                onClick={() => handleGenerate()}
                                disabled={isLoading || !intent}
                                style={{ position: 'absolute', right: '8px', backgroundColor: '#00e5ff', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <span style={{ fontSize: '16px', color: '#000' }}>{isLoading ? '...' : '▶'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Center Panel */}
                <div style={{ flex: 1, backgroundColor: '#080808', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '40px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
                        <span style={{ color: '#00e5ff', fontSize: '12px' }}>&lt;/&gt;</span>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#aaa' }}>Generated Code</div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                        {!currentUI ? (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                                <div style={{ fontSize: '32px', marginBottom: '12px' }}>&lt;/&gt;</div>
                                <div style={{ fontSize: '12px' }}>Code will appear here</div>
                            </div>
                        ) : (
                            <pre style={{ margin: '20px', fontSize: '12px', lineHeight: '1.6', color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>
                                <code>{currentUI.code}</code>
                            </pre>
                        )}
                    </div>
                </div>

                {/* Right Panel */}
                <div style={{ flex: 1.2, backgroundColor: '#050505', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '40px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
                        <span style={{ color: '#00e5ff', fontSize: '14px' }}>👁</span>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#aaa' }}>Live Preview</div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', background: '#050505' }}>
                        {!currentUI ? (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                                <div style={{ fontSize: '32px', marginBottom: '12px' }}>👁</div>
                                <div style={{ fontSize: '12px' }}>Preview will render here</div>
                            </div>
                        ) : (
                            <div style={{ padding: '40px' }}>
                                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                    <RenderEngine components={currentUI.plan?.components} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
