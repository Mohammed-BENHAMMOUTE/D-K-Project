{{/*
Expand the name of the chart.
*/}}
{{- define "dkProject.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "dkProject.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "dkProject.labels" -}}
helm.sh/chart: {{ include "dkProject.chart" . }}
{{ include "dkProject.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "dkProject.selectorLabels" -}}
app.kubernetes.io/name: {{ include "dkProject.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}