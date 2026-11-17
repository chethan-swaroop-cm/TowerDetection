const API_URL = 'http://127.0.0.1:5000/predict';

// DOM Elements
const fileInput = document.getElementById('file-input');
const chooseBtn = document.getElementById('choose-btn');
const dropZone = document.getElementById('drop-zone');
const fileInfo = document.getElementById('file-info');
const filenameSpan = document.getElementById('filename');
const filesizeSpan = document.getElementById('filesize');
const removeBtn = document.getElementById('remove-btn');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const executeBtn = document.getElementById('execute-btn');
const executeText = document.getElementById('execute-text');
const executeIcon = document.getElementById('execute-icon');
const retryBtn = document.getElementById('retry-btn');
const globalStatusInd = document.getElementById('global-status-ind');
const globalStatusText = document.getElementById('global-status-text');

// Pipeline Steps
const steps = ['upload', 'progress', 'execute', 'quality', 'detection', 'completion', 'output'];

// Result Containers
const emptyState = document.getElementById('empty-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const successNotification = document.getElementById('success-notification');
const resultsContainer = document.getElementById('results-container');
const qualityCard = document.getElementById('quality-card');

let selectedFile = null;

// Initialization
function init() {
    setupEventListeners();
    resetUI();
}

function setupEventListeners() {
    chooseBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    removeBtn.addEventListener('click', resetUI);
    retryBtn.addEventListener('click', resetUI);
    document.getElementById('reset-success-btn').addEventListener('click', resetUI);
    executeBtn.addEventListener('click', executeAnalysis);
}

function handleFileSelect(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        alert("Unsupported format. Please select JPG, JPEG, or PNG.");
        return;
    }

    selectedFile = file;
    
    // Update File Info
    filenameSpan.textContent = file.name;
    filesizeSpan.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    
    // Hide dropzone, show info and preview
    dropZone.classList.add('hidden');
    fileInfo.classList.remove('hidden');
    
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);

    // Enable execute
    executeBtn.disabled = false;
    executeText.textContent = "EXECUTE AI ANALYSIS";
    executeIcon.textContent = "▶";
    executeBtn.style.backgroundColor = "var(--accent-primary)";
    
    // Reset right panel to empty state
    errorState.classList.add('hidden');
    successNotification.classList.add('hidden');
    resultsContainer.classList.add('hidden');
    emptyState.classList.remove('hidden');
    qualityCard.classList.add('hidden');
    
    setPipelineStep('progress');
    updateGlobalStatus('processing', 'UPLOADING IMAGE...');
    
    // Simulate upload progress
    const progContainer = document.getElementById('upload-progress-container');
    const progFill = document.getElementById('upload-progress-fill');
    const progPercent = document.getElementById('upload-progress-percent');
    const progLabel = document.getElementById('upload-progress-label');
    
    progContainer.classList.remove('hidden');
    progLabel.textContent = 'UPLOADING IMAGE...';
    progFill.style.width = '0%';
    progPercent.textContent = '0%';
    
    executeBtn.disabled = true;
    
    let percent = 0;
    const interval = setInterval(() => {
        percent += 20;
        progFill.style.width = percent + '%';
        progPercent.textContent = percent + '%';
        if(percent >= 100) {
            clearInterval(interval);
            progLabel.textContent = '✓ UPLOAD COMPLETE';
            setPipelineStep('execute');
            updateGlobalStatus('ready', 'EXECUTE READY');
            
            // Enable execute
            executeBtn.disabled = false;
            executeText.textContent = "EXECUTE DETECTION";
            executeIcon.textContent = "▶";
            executeBtn.style.backgroundColor = "var(--accent-primary)";
        }
    }, 100);
}

function resetUI() {
    selectedFile = null;
    fileInput.value = "";
    dropZone.classList.remove('hidden');
    fileInfo.classList.add('hidden');
    previewContainer.classList.add('hidden');
    imagePreview.src = "";
    
    executeBtn.disabled = true;
    executeText.textContent = "EXECUTE DETECTION";
    executeIcon.textContent = "▶";
    executeBtn.style.backgroundColor = "";
    
    errorState.classList.add('hidden');
    successNotification.classList.add('hidden');
    resultsContainer.classList.add('hidden');
    emptyState.classList.remove('hidden');
    qualityCard.classList.add('hidden');
    
    setPipelineStep('upload');
    updateGlobalStatus('ready', 'WAITING FOR IMAGE');
    
    document.getElementById('upload-progress-container').classList.add('hidden');
}

function updateGlobalStatus(state, text) {
    globalStatusInd.className = `status-indicator ${state}`;
    globalStatusText.textContent = text;
}

function setPipelineStep(stepId) {
    let passed = true;
    steps.forEach(s => {
        const el = document.getElementById(`track-${s}`);
        if(!el) return;
        el.className = 'pipeline-step';
        const icon = el.querySelector('.step-icon');
        
        if (s === stepId) {
            el.classList.add('active');
            if(icon) icon.textContent = '●';
            passed = false;
        } else if (passed) {
            el.classList.add('success');
            if(icon) icon.textContent = '✓';
        } else {
            if(icon) icon.textContent = '○';
        }
    });
}

function setPipelineError(stepId) {
    const el = document.getElementById(`track-${stepId}`);
    if(el) {
        el.classList.add('error');
        el.classList.remove('active');
        const icon = el.querySelector('.step-icon');
        if(icon) icon.textContent = '✕';
    }
}

async function executeAnalysis() {
    if (!selectedFile) return;

    // Lock UI
    executeBtn.disabled = true;
    executeText.textContent = "ANALYZING IMAGE...";
    executeIcon.textContent = "◌";
    removeBtn.classList.add('hidden'); // Disable removal during processing
    
    emptyState.classList.add('hidden');
    qualityCard.classList.add('hidden');
    
    setPipelineStep('quality');
    updateGlobalStatus('processing', 'EXECUTING');

    try {
        const formData = new FormData();
        formData.append('image', selectedFile);

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        let data;
        try {
            data = await response.json();
        } catch(e) {
            throw new Error("Invalid JSON from backend API.");
        }

        handleResponse(response.status, data);

    } catch (error) {
        setPipelineError('execute');
        showError(error.message);
        executeText.textContent = "ANALYSIS FAILED";
        executeIcon.textContent = "✕";
        updateGlobalStatus('error', 'SYSTEM ERROR');
    } finally {
        removeBtn.classList.remove('hidden');
    }
}

function handleResponse(statusCode, data) {
    renderQualityCard(data.image_quality || data.quality || {});

    if (statusCode === 400 && data.status === 'rejected') {
        // Quality Rejected
        setPipelineError('quality');
        showError("Image quality rejected. " + (data.message || "") + " Object detection was not executed.");
        executeBtn.disabled = true;
        executeText.textContent = "REJECTED";
        executeIcon.textContent = "✕";
        executeBtn.style.backgroundColor = "var(--danger)";
        updateGlobalStatus('error', 'REJECTED');
        return;
    }

    if (statusCode !== 200) {
        setPipelineError('detection');
        showError(data.message || "An unexpected error occurred during execution.");
        executeBtn.disabled = true;
        executeText.textContent = "FAILED";
        executeIcon.textContent = "✕";
        executeBtn.style.backgroundColor = "var(--danger)";
        updateGlobalStatus('error', 'SYSTEM ERROR');
        return;
    }

    // Success!
    setPipelineStep('output'); // Final step
    executeText.textContent = "ANALYSIS COMPLETE";
    executeIcon.textContent = "✓";
    executeBtn.style.backgroundColor = "var(--success)";
    updateGlobalStatus('complete', 'ANALYSIS COMPLETE');
    
    // Render Results
    errorState.classList.add('hidden');
    successNotification.classList.remove('hidden');
    resultsContainer.classList.remove('hidden');
    
    renderDetections(data);
}

function renderQualityCard(qData) {
    if (!qData || Object.keys(qData).length === 0) return;
    
    qualityCard.classList.remove('hidden');
    
    const badge = document.getElementById('quality-status-badge');
    const reasonContainer = document.getElementById('quality-reason-container');
    const reasonText = document.getElementById('quality-reason-text');
    
    if (qData.status === 'good' || qData.status === 'accepted') {
        badge.className = 'status-badge accepted';
        badge.textContent = '✓ ACCEPTED';
        reasonContainer.classList.add('hidden');
    } else {
        badge.className = 'status-badge rejected';
        badge.textContent = '✕ REJECTED';
        reasonContainer.classList.remove('hidden');
        reasonText.textContent = (qData.reasons || []).join(', ') || "Unknown reason";
    }
    
    document.getElementById('q-blur').textContent = (qData.blur_score !== undefined) ? qData.blur_score.toFixed(2) : '-';
    document.getElementById('q-over').textContent = (qData.overexposed_percentage !== undefined) ? qData.overexposed_percentage.toFixed(2) + '%' : '-';
    document.getElementById('q-under').textContent = (qData.underexposed_percentage !== undefined) ? qData.underexposed_percentage.toFixed(2) + '%' : '-';
}

function renderDetections(data) {
    // 1. Image
    const resImage = document.getElementById('result-image');
    const noResImage = document.getElementById('no-result-image');
    
    if (data.processed_image_url) {
        resImage.src = data.processed_image_url;
        resImage.classList.remove('hidden');
        noResImage.classList.add('hidden');
    } else {
        resImage.classList.add('hidden');
        noResImage.classList.remove('hidden');
    }

    // 2. Summary Stats
    const summary = data.summary || { total_objects: 0, average_confidence: {} };
    const dets = data.detections || [];
    
    document.getElementById('stat-total').textContent = summary.total_objects;
    document.getElementById('img-det-count').textContent = `Detections: ${summary.total_objects}`;
    
    // We expect monopole_tower and supporting_tower
    const averages = summary.average_confidence || {};
    let monoCount = 0;
    let suppCount = 0;
    
    if (averages['monopole_tower']) {
        monoCount = averages['monopole_tower'].count || 0;
    }
    if (averages['supporting_tower']) {
        suppCount = averages['supporting_tower'].count || 0;
    }
    
    document.getElementById('stat-monopole').textContent = monoCount;
    document.getElementById('stat-supporting').textContent = suppCount;
    
    // 3. Confidence Panel
    const confBars = document.getElementById('confidence-bars');
    confBars.innerHTML = '';
    
    ['monopole_tower', 'supporting_tower'].forEach(cls => {
        const classData = averages[cls];
        const confVal = (classData && classData.average_confidence) ? (classData.average_confidence * 100).toFixed(1) : 0;
        const countVal = (classData && classData.count) ? classData.count : 0;
        
        const html = `
            <div class="confidence-item">
                <div class="conf-header">
                    <span>${cls} (${countVal})</span>
                    <span>${confVal}%</span>
                </div>
                <div class="conf-bar-bg">
                    <div class="conf-bar-fill" style="width: ${confVal}%"></div>
                </div>
            </div>
        `;
        confBars.insertAdjacentHTML('beforeend', html);
    });
    
    // 4. Detection Table
    const tbody = document.getElementById('detection-tbody');
    tbody.innerHTML = '';
    
    if (dets.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">0 NO OBJECTS DETECTED</td></tr>`;
    } else {
        dets.forEach(d => {
            const bboxStr = d.bbox ? `[${d.bbox.map(x => x.toFixed(2)).join(', ')}]` : 'N/A';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="color: var(--accent-primary)">${d.class}</td>
                <td>${(d.confidence * 100).toFixed(2)}%</td>
                <td style="color: var(--text-muted)">${bboxStr}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function showError(msg) {
    errorState.classList.remove('hidden');
    errorMessage.textContent = msg;
    resultsContainer.classList.add('hidden');
    successNotification.classList.add('hidden');
}

// Start
init();
