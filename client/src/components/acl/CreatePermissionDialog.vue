<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">
          {{ isEditing ? 'Edit Permission' : 'Create New Permission' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
        <!-- Action -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Action *
          </label>
          <select
            v-model="formData.action"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select action...</option>
            <option value="manage">manage - Full control</option>
            <option value="create">create - Create resources</option>
            <option value="read">read - View resources</option>
            <option value="update">update - Modify resources</option>
            <option value="delete">delete - Remove resources</option>
            <option value="restore">restore - Restore deleted resources</option>
            <option value="export">export - Export data</option>
            <option value="import">import - Import data</option>
            <option value="publish">publish - Publish content</option>
            <option value="archive">archive - Archive content</option>
            <option value="moderate">moderate - Moderate content</option>
            <option value="assign">assign - Assign resources</option>
          </select>
        </div>

        <!-- Subject -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Subject *
          </label>
          <select
            v-model="formData.subject"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select subject...</option>
            <option value="all">all - All resources</option>
            <option value="User">User</option>
            <option value="Story">Story</option>
            <option value="StoryVersion">StoryVersion</option>
            <option value="Attachment">Attachment</option>
            <option value="Category">Category</option>
            <option value="Tag">Tag</option>
            <option value="Session">Session</option>
            <option value="Role">Role</option>
            <option value="Permission">Permission</option>
            <option value="Country">Country</option>
            <option value="Setting">Setting</option>
            <option value="AuditLog">AuditLog</option>
            <option value="PostType">PostType</option>
            <option value="FieldDefinition">FieldDefinition</option>
            <option value="Content">Content</option>
          </select>
        </div>

        <!-- Reason -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <textarea
            v-model="formData.reason"
            rows="2"
            placeholder="Describe why this permission is needed..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          ></textarea>
        </div>

        <!-- Conditions (JSON) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Conditions (JSON)
          </label>
          <textarea
            v-model="conditionsText"
            rows="4"
            placeholder='{"status": "published"}'
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">Optional: JSON object for conditional permissions</p>
        </div>

        <!-- Fields (comma-separated) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Fields
          </label>
          <input
            v-model="fieldsText"
            type="text"
            placeholder="title, content, publishedAt"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p class="text-xs text-gray-500 mt-1">Optional: Comma-separated list of accessible fields</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ error }}
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t flex items-center justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          :disabled="!isValid || saving"
          class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ saving ? 'Saving...' : isEditing ? 'Update Permission' : 'Create Permission' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAclStore } from '../../stores/aclStore';
import type { Permission } from '../../types/acl';

const props = defineProps<{
  permission?: Permission | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

const aclStore = useAclStore();

const formData = ref({
  action: '',
  subject: '',
  reason: '',
});

const conditionsText = ref('');
const fieldsText = ref('');
const saving = ref(false);
const error = ref<string | null>(null);

const isEditing = computed(() => !!props.permission);

const isValid = computed(() => {
  return formData.value.action.trim() !== '' && formData.value.subject.trim() !== '';
});

onMounted(() => {
  if (props.permission) {
    formData.value = {
      action: props.permission.action,
      subject: props.permission.subject,
      reason: props.permission.reason || '',
    };

    if (props.permission.conditions) {
      conditionsText.value = JSON.stringify(props.permission.conditions, null, 2);
    }

    if (props.permission.fields && props.permission.fields.length > 0) {
      fieldsText.value = props.permission.fields.join(', ');
    }
  }
});

const handleSave = async () => {
  if (!isValid.value) return;

  try {
    saving.value = true;
    error.value = null;

    // Parse conditions
    let conditions: Record<string, any> | undefined;
    if (conditionsText.value.trim()) {
      try {
        conditions = JSON.parse(conditionsText.value);
      } catch (e) {
        error.value = 'Invalid JSON in conditions field';
        return;
      }
    }

    // Parse fields
    const fields = fieldsText.value
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f !== '');

    const data = {
      action: formData.value.action,
      subject: formData.value.subject,
      reason: formData.value.reason || undefined,
      conditions: conditions || undefined,
      fields: fields.length > 0 ? fields : undefined,
    };

    if (isEditing.value && props.permission) {
      await aclStore.updatePermission(props.permission.id, {
        reason: data.reason,
        conditions: data.conditions,
        fields: data.fields,
      });
    } else {
      await aclStore.createPermission(data);
    }

    emit('saved');
  } catch (err: any) {
    error.value = err.message || 'Failed to save permission';
  } finally {
    saving.value = false;
  }
};
</script>
