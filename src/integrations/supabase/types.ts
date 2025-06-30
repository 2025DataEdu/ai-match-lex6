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
      query_cache: {
        Row: {
          created_at: string | null
          expires_at: string | null
          generated_sql: string
          hit_count: number | null
          id: string
          original_query: string
          query_hash: string
          result_data: Json | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          generated_sql: string
          hit_count?: number | null
          id?: string
          original_query: string
          query_hash: string
          result_data?: Json | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          generated_sql?: string
          hit_count?: number | null
          id?: string
          original_query?: string
          query_hash?: string
          result_data?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "회원관리"
            referencedColumns: ["아이디"]
          },
        ]
      }
      "경기도 AI 등록 현황": {
        Row: {
          "AI 서비스 유형": string | null
          "도입 지자체": string | null
          "서비스 개시일": string | null
          "서비스 대상": string | null
          서비스명: string | null
          "운영 기관": string | null
          인덱스: number
          활용분야: string | null
        }
        Insert: {
          "AI 서비스 유형"?: string | null
          "도입 지자체"?: string | null
          "서비스 개시일"?: string | null
          "서비스 대상"?: string | null
          서비스명?: string | null
          "운영 기관"?: string | null
          인덱스: number
          활용분야?: string | null
        }
        Update: {
          "AI 서비스 유형"?: string | null
          "도입 지자체"?: string | null
          "서비스 개시일"?: string | null
          "서비스 대상"?: string | null
          서비스명?: string | null
          "운영 기관"?: string | null
          인덱스?: number
          활용분야?: string | null
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
          추출키워드: string | null
          키워드추출상태: string | null
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
          추출키워드?: string | null
          키워드추출상태?: string | null
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
          추출키워드?: string | null
          키워드추출상태?: string | null
        }
        Relationships: []
      }
      관심표시: {
        Row: {
          id: string
          공급기업일련번호: string
          등록일자: string
          사용자아이디: string
          수요기관일련번호: string
        }
        Insert: {
          id?: string
          공급기업일련번호: string
          등록일자?: string
          사용자아이디: string
          수요기관일련번호: string
        }
        Update: {
          id?: string
          공급기업일련번호?: string
          등록일자?: string
          사용자아이디?: string
          수요기관일련번호?: string
        }
        Relationships: []
      }
      문의댓글: {
        Row: {
          id: string
          공급기업일련번호: string
          기관명: string
          댓글내용: string
          매칭id: string
          부모댓글id: string | null
          수요기관일련번호: string
          수정일자: string | null
          작성일자: string
          작성자명: string
          작성자아이디: string
          작성자유형: string
        }
        Insert: {
          id?: string
          공급기업일련번호: string
          기관명: string
          댓글내용: string
          매칭id: string
          부모댓글id?: string | null
          수요기관일련번호: string
          수정일자?: string | null
          작성일자?: string
          작성자명: string
          작성자아이디: string
          작성자유형: string
        }
        Update: {
          id?: string
          공급기업일련번호?: string
          기관명?: string
          댓글내용?: string
          매칭id?: string
          부모댓글id?: string | null
          수요기관일련번호?: string
          수정일자?: string | null
          작성일자?: string
          작성자명?: string
          작성자아이디?: string
          작성자유형?: string
        }
        Relationships: [
          {
            foreignKeyName: "문의댓글_부모댓글id_fkey"
            columns: ["부모댓글id"]
            isOneToOne: false
            referencedRelation: "문의댓글"
            referencedColumns: ["id"]
          },
        ]
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
          추출키워드: string | null
          키워드추출상태: string | null
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
          추출키워드?: string | null
          키워드추출상태?: string | null
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
          추출키워드?: string | null
          키워드추출상태?: string | null
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
      관심통계: {
        Row: {
          공급기업일련번호: string | null
          관심수: number | null
          수요기관일련번호: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      clean_expired_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      execute_dynamic_query: {
        Args: { query_text: string }
        Returns: Json
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
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
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
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
