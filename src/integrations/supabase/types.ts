export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          message: string
          response: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message: string
          response: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      embeddings: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          record_id: string
          table_name: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          record_id: string
          table_name: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          record_id?: string
          table_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      공급기업: {
        Row: {
          공급기업일련번호: string
          관심여부: string | null
          기업명: string | null
          기업홈페이지: string | null
          등록일자: string | null
          문의여부: string | null
          보유특허: string | null
          사용자명: string | null
          세부설명: string | null
          아이디: string | null
          업종: string | null
          유튜브링크: string | null
          유형: string | null
        }
        Insert: {
          공급기업일련번호: string
          관심여부?: string | null
          기업명?: string | null
          기업홈페이지?: string | null
          등록일자?: string | null
          문의여부?: string | null
          보유특허?: string | null
          사용자명?: string | null
          세부설명?: string | null
          아이디?: string | null
          업종?: string | null
          유튜브링크?: string | null
          유형?: string | null
        }
        Update: {
          공급기업일련번호?: string
          관심여부?: string | null
          기업명?: string | null
          기업홈페이지?: string | null
          등록일자?: string | null
          문의여부?: string | null
          보유특허?: string | null
          사용자명?: string | null
          세부설명?: string | null
          아이디?: string | null
          업종?: string | null
          유튜브링크?: string | null
          유형?: string | null
        }
        Relationships: []
      }
      수요기관: {
        Row: {
          관심여부: string | null
          금액: number | null
          기타요구사항: string | null
          등록일자: string | null
          문의일자: string | null
          부서명: string | null
          사용자명: string | null
          수요기관: string | null
          수요기관일련번호: string
          수요내용: string | null
          시작일: string | null
          아이디: string | null
          유형: string | null
          종료일: string | null
        }
        Insert: {
          관심여부?: string | null
          금액?: number | null
          기타요구사항?: string | null
          등록일자?: string | null
          문의일자?: string | null
          부서명?: string | null
          사용자명?: string | null
          수요기관?: string | null
          수요기관일련번호: string
          수요내용?: string | null
          시작일?: string | null
          아이디?: string | null
          유형?: string | null
          종료일?: string | null
        }
        Update: {
          관심여부?: string | null
          금액?: number | null
          기타요구사항?: string | null
          등록일자?: string | null
          문의일자?: string | null
          부서명?: string | null
          사용자명?: string | null
          수요기관?: string | null
          수요기관일련번호?: string
          수요내용?: string | null
          시작일?: string | null
          아이디?: string | null
          유형?: string | null
          종료일?: string | null
        }
        Relationships: []
      }
      제안이력: {
        Row: {
          검토일자: string | null
          공급기업일련번호: string
          등록일자: string | null
          수요기관일련번호: string
          수정일자: string | null
          응답내용: string | null
          제안금액: number | null
          제안내용: string | null
          제안상태: string | null
          제안일련번호: string
          제안일자: string | null
          제안제목: string | null
          첨부파일: string | null
        }
        Insert: {
          검토일자?: string | null
          공급기업일련번호: string
          등록일자?: string | null
          수요기관일련번호: string
          수정일자?: string | null
          응답내용?: string | null
          제안금액?: number | null
          제안내용?: string | null
          제안상태?: string | null
          제안일련번호?: string
          제안일자?: string | null
          제안제목?: string | null
          첨부파일?: string | null
        }
        Update: {
          검토일자?: string | null
          공급기업일련번호?: string
          등록일자?: string | null
          수요기관일련번호?: string
          수정일자?: string | null
          응답내용?: string | null
          제안금액?: number | null
          제안내용?: string | null
          제안상태?: string | null
          제안일련번호?: string
          제안일자?: string | null
          제안제목?: string | null
          첨부파일?: string | null
        }
        Relationships: []
      }
      회원관리: {
        Row: {
          기업명: string | null
          등록일자: string | null
          부서명: string | null
          비밀번호: string | null
          아이디: string
          연락처: string | null
          유형: string | null
          이름: string | null
          이메일: string | null
        }
        Insert: {
          기업명?: string | null
          등록일자?: string | null
          부서명?: string | null
          비밀번호?: string | null
          아이디: string
          연락처?: string | null
          유형?: string | null
          이름?: string | null
          이메일?: string | null
        }
        Update: {
          기업명?: string | null
          등록일자?: string | null
          부서명?: string | null
          비밀번호?: string | null
          아이디?: string
          연락처?: string | null
          유형?: string | null
          이름?: string | null
          이메일?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_embeddings: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          table_name: string
          record_id: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
