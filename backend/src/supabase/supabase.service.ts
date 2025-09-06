import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('supabase.url') || 'http://localhost:54321';
    const supabaseAnonKey = this.configService.get<string>('supabase.anonKey') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    const supabaseServiceKey = this.configService.get<string>('supabase.serviceRoleKey') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

    // Client for regular operations (respects RLS)
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Admin client for service operations (bypasses RLS)
    this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  // Get client with user session (respects RLS)
  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Get admin client (bypasses RLS)
  getAdminClient(): SupabaseClient {
    return this.supabaseAdmin;
  }

  // Set user session for RLS context
  setUserSession(accessToken: string) {
    this.supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: '', // Not needed for this use case
    });
  }

  // Verify JWT token
  async verifyToken(token: string) {
    try {
      const { data, error } = await this.supabase.auth.getUser(token);
      if (error) {
        throw error;
      }
      return data.user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Upload file to storage
  async uploadFile(bucket: string, path: string, file: Buffer, options?: any) {
    const { data, error } = await this.supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, options);

    if (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }

    return data;
  }

  // Get signed URL for file
  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
    const { data, error } = await this.supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  // Delete file from storage
  async deleteFile(bucket: string, path: string) {
    const { error } = await this.supabaseAdmin.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }

    return true;
  }

  // Execute raw SQL query (admin only)
  async query(sql: string, params?: any[]) {
    try {
      const { data, error } = await this.supabaseAdmin.rpc('execute_sql', {
        query: sql,
        parameters: params,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }
}
