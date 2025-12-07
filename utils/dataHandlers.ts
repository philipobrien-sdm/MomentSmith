
import { Capture } from '../types';

export const exportJSON = (captures: Capture[]) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(captures, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `momentsmith_export_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const exportHTML = (captures: Capture[], digestContent: string | null, algorithmContent: string | null) => {
  // Simple markdown cleaner for the report
  const formatMd = (text: string | null) => {
    if (!text) return '<p class="empty-state">No data generated.</p>';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/^## (.*$)/gim, '<h2>$1</h2>') // H2
      .replace(/^### (.*$)/gim, '<h3>$1</h3>') // H3
      .replace(/^# (.*$)/gim, '<h1>$1</h1>') // H1
      .replace(/^\* (.*$)/gim, '<li>$1</li>') // List items
      .replace(/\n/g, '<br/>'); // Line breaks
  };

  const captureRows = captures.map(c => `
    <div class="capture-card">
      <div class="meta">
        <span class="category tag-${c.category.replace(/\s+/g, '-').toLowerCase()}">${c.category}</span>
        <span class="time">${new Date(c.timestamp).toLocaleString()}</span>
      </div>
      <p class="text">${c.text}</p>
      <div class="summary">Summary: ${c.summary}</div>
      <div class="tags">${c.tags.map(t => `#${t}`).join(' ')}</div>
    </div>
  `).join('');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>MomentSmith Dossier - ${new Date().toLocaleDateString()}</title>
<style>
  body { font-family: 'Georgia', serif; background: #fdfbf7; color: #1c1c1e; line-height: 1.6; max-width: 800px; mx-auto; padding: 40px; margin: 0 auto; }
  h1 { font-family: 'Arial', sans-serif; border-bottom: 2px solid #1c1c1e; padding-bottom: 10px; margin-bottom: 30px; }
  h2 { font-family: 'Arial', sans-serif; background: #e2e8f0; padding: 8px 12px; border-radius: 4px; font-size: 1.2rem; margin-top: 40px; }
  h3 { font-family: 'Arial', sans-serif; font-size: 1.1rem; color: #475569; margin-top: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
  .section { margin-bottom: 40px; background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
  
  .capture-card { border-bottom: 1px solid #f1f5f9; padding: 20px 0; }
  .capture-card:last-child { border-bottom: none; }
  .meta { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px; font-family: 'Arial', sans-serif; }
  .time { color: #64748b; }
  .text { font-size: 1.1rem; margin-bottom: 8px; }
  .summary { font-size: 0.9rem; color: #64748b; font-style: italic; background: #f8fafc; padding: 8px; border-left: 3px solid #cbd5e1; }
  .tags { font-size: 0.8rem; color: #94a3b8; margin-top: 8px; }
  
  .category { padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 0.7rem; }
  .tag-app-idea { background: #dbeafe; color: #1e40af; }
  .tag-philosophy { background: #f3e8ff; color: #6b21a8; }
  .tag-venting { background: #fef2f2; color: #991b1b; }
  .tag-absurd-observation { background: #fef9c3; color: #854d0e; }
  
  strong { color: #0f172a; }
  .empty-state { color: #94a3b8; font-style: italic; }
  
  @media print {
    body { background: white; max-width: 100%; padding: 0; }
    .section { border: none; padding: 0; }
  }
</style>
</head>
<body>
<h1>MomentSmith Dossier</h1>
<p>Generated: ${new Date().toLocaleString()}</p>
<p>Total Captures: ${captures.length}</p>

<div class="section">
  <h2>The Algorithm Mirror</h2>
  ${formatMd(algorithmContent)}
</div>

<div class="section">
  <h2>Weekly Digest</h2>
  ${formatMd(digestContent)}
</div>

<div class="section">
  <h2>Capture Log</h2>
  ${captureRows}
</div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `momentsmith_report_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
