package com.siotman.wos.yourpaper.domain.entity;

import com.siotman.wos.yourpaper.domain.converter.JsonListConverter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Paper {
    @Id
    @Column(length = 128)
    private String uid;
    @Column(length = 128)
    private String doi;

    private String title;

    @OneToMany(mappedBy = "paper", fetch = FetchType.LAZY)
    private Set<UserPaper> users;

    @Lob
    @Convert(converter = JsonListConverter.class)
    private List<String> authorListJson;

    @Enumerated(EnumType.STRING)
    @Column(length = 16)
    private RecordType recordType;

    @Enumerated(EnumType.STRING)
    @Column(length = 16)
    private RecordState recordState;

    @UpdateTimestamp
    private LocalDateTime lastUpdates;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "src_info_id", referencedColumnName = "id")
    private SourceInfo sourceInfo;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "parsed_data_id", referencedColumnName = "id")
    private ParsedData parsedData;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "paper_urls_id", referencedColumnName = "id")
    private PaperUrls paperUrls;


}